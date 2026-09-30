"""Weather Forecast API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import Optional, List, Dict, Any

from backend.src.db.connection import get_db
from backend.src.db.repositories import PanchayatRepository, ForecastRepository
from backend.src.api.dependencies import (
    feature_engineer,
    trainer,
    forecast_fetcher,
    check_rate_limit,
)
from backend.src.api.schemas.forecast import (
    PanchayatMetadata,
    ForecastParameter,
    UncertaintyRange,
    SingleForecastDay,
    PanchayatForecastResponse,
    BlockComparisonResponse,
    PanchayatComparisonItem,
)
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.validators import validate_iso_date, sanitize_panchayat_id, validate_lat_lon

router = APIRouter(tags=["Weather Forecast"])

@router.get("/forecast/grid", response_model=ApiResponse)
def get_grid_forecast(
    lat: float = Query(..., description="Latitude coordinate"),
    lon: float = Query(..., description="Longitude coordinate"),
    date_str: Optional[str] = Query(None, alias="date", description="Forecast date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    _: None = Depends(check_rate_limit),
):
    """Get downscaled forecast for a specific lat/lon coordinate via nearest micro-grid point."""
    if not validate_lat_lon(lat, lon):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "INVALID_COORDINATES", "message": "Latitude/longitude out of valid geographic range"},
        )

    p_repo = PanchayatRepository(db)
    panchayats = p_repo.search(lat=lat, lon=lon, radius_km=500.0)
    if not panchayats:
        panchayats = p_repo.get_all(limit=1)

    nearest = panchayats[0]
    return get_panchayat_forecast(
        panchayat_id=nearest.id,
        date_str=date_str,
        days=3,
        include_uncertainty=True,
        include_block=True,
        db=db,
    )

@router.get("/forecast/{panchayat_id}", response_model=ApiResponse)
def get_panchayat_forecast(
    panchayat_id: str,
    date_str: Optional[str] = Query(None, alias="date", description="Forecast date (YYYY-MM-DD)"),
    days: int = Query(3, ge=1, le=5, description="Number of forecast days (1-5)"),
    include_uncertainty: bool = Query(False, description="Include 90% confidence intervals"),
    include_block: bool = Query(False, description="Include original block forecast for comparison"),
    db: Session = Depends(get_db),
    _: None = Depends(check_rate_limit),
):
    """Get high-resolution AI downscaled weather forecast for a specific Panchayat."""
    panchayat_id = sanitize_panchayat_id(panchayat_id)
    p_repo = PanchayatRepository(db)
    fc_repo = ForecastRepository(db)

    panchayat = p_repo.get_by_id(panchayat_id)
    if not panchayat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "PANCHAYAT_NOT_FOUND", "message": f"No Panchayat found with ID '{panchayat_id}'"},
        )

    start_date = validate_iso_date(date_str) if date_str else date.today()
    if date_str and not start_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_DATE", "message": "Date must be in YYYY-MM-DD format", "field": "date"},
        )

    # Fetch/Generate block forecast
    block_forecasts = forecast_fetcher.fetch_block_forecast(
        block_id=panchayat.block_id,
        forecast_date=start_date,
        lead_days=days,
    )

    panchayat_meta = {
        "elevation_mean": panchayat.elevation_mean,
        "slope_mean": panchayat.slope_mean,
        "aspect_dominant": panchayat.aspect_dominant,
        "lulc_cropland_pct": panchayat.lulc_cropland_pct,
        "lulc_forest_pct": panchayat.lulc_forest_pct,
        "lulc_urban_pct": panchayat.lulc_urban_pct,
        "lulc_water_pct": panchayat.lulc_water_pct,
        "ndvi": panchayat.ndvi,
        "dist_to_water_km": panchayat.dist_to_water_km,
        "dist_to_coast_km": panchayat.dist_to_coast_km,
        "latitude": panchayat.latitude,
        "longitude": panchayat.longitude,
    }

    forecast_days_res: List[SingleForecastDay] = []

    for bfc in block_forecasts:
        # Create 24-feature vector
        feat_vec = feature_engineer.create_features(bfc, panchayat_meta)

        # Predict with Ensemble Models
        t_max, t_low, t_up, conf_t = trainer.temp_model.predict_with_uncertainty(feat_vec)
        rain, r_low, r_up, conf_r = trainer.rain_model.predict_with_uncertainty(feat_vec)
        rh, _, _, _ = trainer.rh_model.predict_with_uncertainty(feat_vec)
        wind, _, _, _ = trainer.wind_model.predict_with_uncertainty(feat_vec)

        # Derived min temp
        t_min = round(max(5.0, t_max - (bfc["temp_max"] - bfc["temp_min"])), 1)
        mean_conf = round((conf_t + conf_r) / 2.0, 2)

        params = {
            "temp_max": ForecastParameter(value=t_max, unit="°C"),
            "temp_min": ForecastParameter(value=t_min, unit="°C"),
            "rainfall": ForecastParameter(value=rain, unit="mm"),
            "humidity": ForecastParameter(value=rh, unit="%"),
            "wind_speed": ForecastParameter(value=wind, unit="km/h"),
        }

        uncertainty = None
        if include_uncertainty:
            uncertainty = {
                "temp_max": UncertaintyRange(lower=t_low, upper=t_up),
                "rainfall": UncertaintyRange(lower=r_low, upper=r_up),
            }

        block_data = None
        if include_block:
            block_data = {
                "temp_max": bfc["temp_max"],
                "temp_min": bfc["temp_min"],
                "rainfall": bfc["rainfall"],
                "humidity": bfc["humidity"],
                "wind_speed": bfc["wind_speed"],
            }

        forecast_days_res.append(
            SingleForecastDay(
                date=bfc["forecast_date"],
                lead_days=bfc["lead_days"],
                parameters=params,
                confidence=mean_conf,
                uncertainty=uncertainty,
                block_forecast=block_data,
            )
        )

    response_payload = PanchayatForecastResponse(
        panchayat=PanchayatMetadata(
            id=panchayat.id,
            name=panchayat.name,
            name_hi=panchayat.name_hi,
            name_mr=panchayat.name_mr,
            name_ta=panchayat.name_ta,
            block=panchayat.block_name,
            district=panchayat.district,
            state=panchayat.state,
            elevation_m=panchayat.elevation_mean,
            latitude=panchayat.latitude,
            longitude=panchayat.longitude,
        ),
        forecasts=forecast_days_res,
        model_version="v2.3.1",
        generated_at=datetime.utcnow(),
    )

    return ApiResponse(status="success", data=response_payload.dict())

@router.get("/forecast/block/{block_id}", response_model=ApiResponse)
def get_block_forecast_comparison(
    block_id: str,
    date_str: Optional[str] = Query(None, alias="date", description="Forecast date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    _: None = Depends(check_rate_limit),
):
    """Get forecasts for all Panchayats within a block to compare micro-climate intra-block variations."""
    p_repo = PanchayatRepository(db)
    panchayats = p_repo.get_by_block(block_id)
    if not panchayats:
        # Fallback to search if not exact match
        panchayats = p_repo.search(query=block_id.split("_")[-1])

    if not panchayats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "BLOCK_NOT_FOUND", "message": f"No block found with ID '{block_id}'"},
        )

    start_date = validate_iso_date(date_str) if date_str else date.today()
    bfc_list = forecast_fetcher.fetch_block_forecast(block_id=block_id, forecast_date=start_date, lead_days=1)
    bfc = bfc_list[0]

    panchayat_items: List[PanchayatComparisonItem] = []
    temps = []
    rains = []

    for p in panchayats:
        pmeta = {
            "elevation_mean": p.elevation_mean,
            "slope_mean": p.slope_mean,
            "aspect_dominant": p.aspect_dominant,
            "lulc_cropland_pct": p.lulc_cropland_pct,
            "lulc_forest_pct": p.lulc_forest_pct,
            "lulc_urban_pct": p.lulc_urban_pct,
            "lulc_water_pct": p.lulc_water_pct,
            "ndvi": p.ndvi,
            "dist_to_water_km": p.dist_to_water_km,
            "dist_to_coast_km": p.dist_to_coast_km,
            "latitude": p.latitude,
            "longitude": p.longitude,
        }
        fvec = feature_engineer.create_features(bfc, pmeta)
        t_max, _, _, _ = trainer.temp_model.predict_with_uncertainty(fvec)
        rain, _, _, _ = trainer.rain_model.predict_with_uncertainty(fvec)

        temps.append(t_max)
        rains.append(rain)

        panchayat_items.append(
            PanchayatComparisonItem(
                panchayat_id=p.id,
                name=p.name,
                elevation_m=p.elevation_mean,
                temp_max=t_max,
                rainfall=rain,
                deviation_from_block={
                    "temp_max": round(t_max - bfc["temp_max"], 1),
                    "rainfall": round(rain - bfc["rainfall"], 1),
                },
            )
        )

    res = BlockComparisonResponse(
        block={
            "id": block_id,
            "name": panchayats[0].block_name,
            "district": panchayats[0].district,
            "panchayat_count": len(panchayats),
        },
        block_forecast={"date": str(start_date), "temp_max": bfc["temp_max"], "rainfall": bfc["rainfall"]},
        panchayat_forecasts=panchayat_items,
        statistics={
            "temp_max_range": [min(temps), max(temps)],
            "rainfall_range": [min(rains), max(rains)],
            "max_deviation_temp": round(max(abs(t - bfc["temp_max"]) for t in temps), 1),
            "max_deviation_rain": round(max(abs(r - bfc["rainfall"]) for r in rains), 1),
        },
    )

    return ApiResponse(status="success", data=res.dict())

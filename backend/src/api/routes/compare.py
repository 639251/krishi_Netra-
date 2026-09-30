"""Comparison Endpoints between Block-level NWP and Downscaled Panchayat models."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from backend.src.db.connection import get_db
from backend.src.db.repositories import PanchayatRepository
from backend.src.api.dependencies import feature_engineer, trainer, forecast_fetcher
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.validators import validate_iso_date

router = APIRouter(tags=["Micro-Climate Comparison"])

@router.get("/compare/{block_id}", response_model=ApiResponse)
def compare_block_microclimates(
    block_id: str,
    date_str: Optional[str] = Query(None, alias="date", description="Comparison date (YYYY-MM-DD)"),
    parameter: str = Query("temp_max", description="Parameter to compare (temp_max/rainfall/humidity/wind_speed)"),
    db: Session = Depends(get_db),
):
    """
    Detailed micro-climate variance analysis across Panchayats within a single IMD block,
    demonstrating the ~25km block model error versus 1km downscaled reality.
    """
    p_repo = PanchayatRepository(db)
    panchayats = p_repo.get_by_block(block_id)
    if not panchayats:
        panchayats = p_repo.search(query=block_id.split("_")[-1])

    if not panchayats:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "BLOCK_NOT_FOUND", "message": f"Block ID '{block_id}' not found"},
        )

    target_date = validate_iso_date(date_str) if date_str else date.today()
    bfc_list = forecast_fetcher.fetch_block_forecast(block_id=block_id, forecast_date=target_date, lead_days=1)
    bfc = bfc_list[0]

    panchayat_results = []
    param_values = []

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
        rh, _, _, _ = trainer.rh_model.predict_with_uncertainty(fvec)
        wind, _, _, _ = trainer.wind_model.predict_with_uncertainty(fvec)

        val_map = {"temp_max": t_max, "rainfall": rain, "humidity": rh, "wind_speed": wind}
        chosen_val = val_map.get(parameter, t_max)
        param_values.append(chosen_val)

        block_val = bfc.get(parameter, 30.0)

        panchayat_results.append({
            "panchayat_id": p.id,
            "name": p.name,
            "elevation_m": p.elevation_mean,
            "slope_deg": p.slope_mean,
            "soil_type": p.soil_type,
            "downscaled_value": chosen_val,
            "block_value": block_val,
            "delta": round(chosen_val - block_val, 1),
            "temp_max": t_max,
            "rainfall": rain,
            "humidity": rh,
            "wind_speed": wind,
        })

    block_val = bfc.get(parameter, 30.0)
    max_dev = round(max(abs(v - block_val) for v in param_values), 1)

    return ApiResponse(
        status="success",
        data={
            "block_id": block_id,
            "parameter": parameter,
            "block_forecast": bfc,
            "panchayats": panchayat_results,
            "variance_summary": {
                "min": min(param_values),
                "max": max(param_values),
                "range": round(max(param_values) - min(param_values), 1),
                "max_deviation_from_block": max_dev,
            },
        },
    )

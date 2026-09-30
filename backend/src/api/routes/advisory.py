"""Agricultural Advisory API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import date, datetime
from typing import Optional, List, Dict, Any

from backend.src.db.connection import get_db
from backend.src.db.repositories import PanchayatRepository, AdvisoryRepository
from backend.src.api.dependencies import (
    rule_engine,
    feature_engineer,
    trainer,
    forecast_fetcher,
    check_rate_limit,
)
from backend.src.api.schemas.advisory import SingleAdvisoryItem, PanchayatAdvisoryResponse
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.validators import validate_iso_date, sanitize_panchayat_id

router = APIRouter(tags=["Agro-Advisories"])

@router.get("/advisory/{panchayat_id}", response_model=ApiResponse)
def get_panchayat_advisory(
    panchayat_id: str,
    crop: str = Query("Rice", description="Target crop (Rice/Wheat/Cotton/Soybean/Grapes/Sugarcane/Onion/Mustard)"),
    stage: str = Query("Flowering & Tillering", description="Crop growth stage"),
    language: str = Query("en", description="Language code (en/hi/mr/ta)"),
    date_str: Optional[str] = Query(None, alias="date", description="Advisory date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    _: None = Depends(check_rate_limit),
):
    """Get actionable agricultural advisory for a specific Panchayat, tailored to crop & language."""
    panchayat_id = sanitize_panchayat_id(panchayat_id)
    p_repo = PanchayatRepository(db)

    panchayat = p_repo.get_by_id(panchayat_id)
    if not panchayat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "PANCHAYAT_NOT_FOUND", "message": f"No Panchayat found with ID '{panchayat_id}'"},
        )

    target_date = validate_iso_date(date_str) if date_str else date.today()
    if date_str and not target_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_DATE", "message": "Date must be in YYYY-MM-DD format"},
        )

    # 1. Fetch downscaled weather for this panchayat
    bfc_list = forecast_fetcher.fetch_block_forecast(block_id=panchayat.block_id, forecast_date=target_date, lead_days=1)
    bfc = bfc_list[0]

    pmeta = {
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

    fvec = feature_engineer.create_features(bfc, pmeta)
    t_max, _, _, _ = trainer.temp_model.predict_with_uncertainty(fvec)
    rain, _, _, _ = trainer.rain_model.predict_with_uncertainty(fvec)
    rh, _, _, _ = trainer.rh_model.predict_with_uncertainty(fvec)
    wind, _, _, _ = trainer.wind_model.predict_with_uncertainty(fvec)

    weather_summary = {
        "temp_max": t_max,
        "rainfall": rain,
        "humidity": rh,
        "wind_speed": wind,
        "condition": "Moderate to heavy rain expected" if rain > 15 else "Clear to partly cloudy",
    }

    # 2. Evaluate Rule Engine
    advisory_items = rule_engine.generate_advisories(
        panchayat_id=panchayat_id,
        forecast_date=target_date,
        weather={"temp_max": t_max, "rainfall": rain, "humidity": rh, "wind_speed": wind},
        crop=crop,
        crop_stage=stage,
    )

    lang = language.lower() if language.lower() in ["en", "hi", "mr", "ta"] else "en"

    formatted_advisories: List[SingleAdvisoryItem] = []
    for adv in advisory_items:
        title_text = adv["title"].get(lang, adv["title"].get("en", "Crop Advisory"))
        msg_text = adv["message"].get(lang, adv["message"].get("en", "Advisory details."))

        formatted_advisories.append(
            SingleAdvisoryItem(
                id=adv["id"],
                severity=adv["severity"],
                crop=crop,
                crop_stage=stage,
                action_type=adv["action_type"],
                title=title_text,
                message=msg_text,
                action_items=adv.get("action_items"),
                scientific_rationale=adv.get("scientific_rationale"),
                valid_from=adv.get("valid_from"),
                valid_until=adv.get("valid_until"),
            )
        )

    res = PanchayatAdvisoryResponse(
        panchayat_id=panchayat_id,
        date=target_date,
        weather_summary=weather_summary,
        advisories=formatted_advisories,
        language=lang,
    )

    return ApiResponse(status="success", data=res.dict())

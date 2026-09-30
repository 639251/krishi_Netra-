"""FastAPI Dependency Injection and Service Singletons."""
from fastapi import Depends, HTTPException, Security, Request, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any

from backend.src.db.connection import get_db, init_db, SessionLocal
from backend.src.db.repositories import (
    PanchayatRepository,
    ForecastRepository,
    AdvisoryRepository,
    StationRepository,
)
from backend.src.db.models import (
    PanchayatModel,
    StationModel,
    StationReadingModel,
    ApiKeyModel,
)
from backend.src.api.middleware.auth import security, verify_jwt_token
from backend.src.api.middleware.rate_limiter import rate_limiter
from backend.src.preprocessing.feature_engineering import FeatureEngineer
from backend.src.models.ensemble import EnsembleDownscaler
from backend.src.models.trainer import ModelTrainer
from backend.src.advisory.rule_engine import AdvisoryRuleEngine
from backend.src.delivery.sms_service import SMSService
from backend.src.delivery.whatsapp_service import WhatsAppService
from backend.src.ingestion.forecast_fetcher import IMDForecastFetcher
from backend.src.utils.logger import logger

# Singleton service instances
feature_engineer = FeatureEngineer()
trainer = ModelTrainer()
trainer.train_all_models()
rule_engine = AdvisoryRuleEngine()
forecast_fetcher = IMDForecastFetcher()
sms_service = SMSService()
whatsapp_service = WhatsAppService()

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    if not rate_limiter.check_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "Rate limit of 1000 requests/minute exceeded. Please retry later.",
            },
        )

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Optional[Dict[str, Any]]:
    if not credentials:
        return None
    token = credentials.credentials
    payload = verify_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHORIZED", "message": "Invalid or expired access token"},
        )
    return payload

def seed_initial_data_if_empty():
    """Seeds rich database with initial Indian Panchayats, AWS stations, and historical records."""
    init_db()
    db = SessionLocal()
    try:
        if db.query(PanchayatModel).count() == 0:
            logger.info("Seeding database with high-resolution Indian Panchayats & Weather Stations...")

            panchayats_data = [
                {
                    "id": "MH_PUNE_MULSHI_TAMHINI",
                    "name": "Tamhini Ghat",
                    "name_hi": "ताम्हिणी घाट",
                    "name_mr": "ताम्हिणी घाट",
                    "name_ta": "தாமினி காட்",
                    "block_id": "MH_PUNE_MULSHI",
                    "block_name": "Mulshi",
                    "district": "Pune",
                    "state": "Maharashtra",
                    "latitude": 18.4521,
                    "longitude": 73.4287,
                    "elevation_mean": 650.0,
                    "elevation_std": 45.0,
                    "slope_mean": 18.5,
                    "aspect_dominant": 260.0,
                    "lulc_class": "forest_dense",
                    "lulc_cropland_pct": 35.0,
                    "lulc_forest_pct": 55.0,
                    "lulc_urban_pct": 2.0,
                    "lulc_water_pct": 8.0,
                    "soil_type": "red_laterite",
                    "ndvi": 0.88,
                    "dist_to_water_km": 1.2,
                    "dist_to_coast_km": 55.0,
                    "nearest_aws_id": "AWS_MH_PUNE_01",
                    "nearest_aws_dist_km": 8.5,
                },
                {
                    "id": "MH_PUNE_MULSHI_PAUD",
                    "name": "Paud",
                    "name_hi": "पौड",
                    "name_mr": "पौड",
                    "name_ta": "பவுட்",
                    "block_id": "MH_PUNE_MULSHI",
                    "block_name": "Mulshi",
                    "district": "Pune",
                    "state": "Maharashtra",
                    "latitude": 18.5312,
                    "longitude": 73.6124,
                    "elevation_mean": 580.0,
                    "elevation_std": 12.0,
                    "slope_mean": 3.8,
                    "aspect_dominant": 175.0,
                    "lulc_class": "cropland",
                    "lulc_cropland_pct": 75.0,
                    "lulc_forest_pct": 10.0,
                    "lulc_urban_pct": 8.0,
                    "lulc_water_pct": 7.0,
                    "soil_type": "black_cotton",
                    "ndvi": 0.72,
                    "dist_to_water_km": 3.0,
                    "dist_to_coast_km": 82.0,
                    "nearest_aws_id": "AWS_MH_PUNE_01",
                    "nearest_aws_dist_km": 14.2,
                },
                {
                    "id": "MH_NSK_NIPHAD_PIMPALGAON",
                    "name": "Pimpalgaon Baswant",
                    "name_hi": "पिंपलगांव बसवंत",
                    "name_mr": "पिंपळगाव बसवंत",
                    "name_ta": "பிம்பல்கான் பஸ்வந்த்",
                    "block_id": "MH_NSK_NIPHAD",
                    "block_name": "Niphad",
                    "district": "Nashik",
                    "state": "Maharashtra",
                    "latitude": 20.1742,
                    "longitude": 73.9856,
                    "elevation_mean": 590.0,
                    "elevation_std": 8.0,
                    "slope_mean": 2.2,
                    "aspect_dominant": 140.0,
                    "lulc_class": "cropland",
                    "lulc_cropland_pct": 85.0,
                    "lulc_forest_pct": 2.0,
                    "lulc_urban_pct": 10.0,
                    "lulc_water_pct": 3.0,
                    "soil_type": "black_cotton",
                    "ndvi": 0.81,
                    "dist_to_water_km": 4.5,
                    "dist_to_coast_km": 140.0,
                    "nearest_aws_id": "AWS_MH_NSK_02",
                    "nearest_aws_dist_km": 6.8,
                },
                {
                    "id": "MP_SEH_SEHORE_JAHANGIRPUR",
                    "name": "Jahangirpur",
                    "name_hi": "जहांगीरपुर",
                    "name_mr": "जहांगीरपूर",
                    "name_ta": "ஜஹாங்கீர்பூர்",
                    "block_id": "MP_SEH_SEHORE",
                    "block_name": "Sehore",
                    "district": "Sehore",
                    "state": "Madhya Pradesh",
                    "latitude": 23.2045,
                    "longitude": 77.0854,
                    "elevation_mean": 502.0,
                    "elevation_std": 6.5,
                    "slope_mean": 1.5,
                    "aspect_dominant": 180.0,
                    "lulc_class": "cropland",
                    "lulc_cropland_pct": 88.0,
                    "lulc_forest_pct": 4.0,
                    "lulc_urban_pct": 3.0,
                    "lulc_water_pct": 5.0,
                    "soil_type": "black_cotton",
                    "ndvi": 0.74,
                    "dist_to_water_km": 2.1,
                    "dist_to_coast_km": 520.0,
                    "nearest_aws_id": "AWS_MP_BPL_01",
                    "nearest_aws_dist_km": 19.5,
                },
                {
                    "id": "PB_LDH_JAGRAON_SIDHWAN",
                    "name": "Sidhwan Bet",
                    "name_hi": "सिद्धवां बेट",
                    "name_mr": "सिद्धवा बेट",
                    "name_ta": "சித்வான் பெட்",
                    "block_id": "PB_LDH_JAGRAON",
                    "block_name": "Jagraon",
                    "district": "Ludhiana",
                    "state": "Punjab",
                    "latitude": 30.9854,
                    "longitude": 75.5214,
                    "elevation_mean": 235.0,
                    "elevation_std": 3.0,
                    "slope_mean": 0.8,
                    "aspect_dominant": 210.0,
                    "lulc_class": "cropland",
                    "lulc_cropland_pct": 92.0,
                    "lulc_forest_pct": 1.0,
                    "lulc_urban_pct": 5.0,
                    "lulc_water_pct": 2.0,
                    "soil_type": "alluvial",
                    "ndvi": 0.85,
                    "dist_to_water_km": 1.8,
                    "dist_to_coast_km": 950.0,
                    "nearest_aws_id": "AWS_PB_LDH_01",
                    "nearest_aws_dist_km": 11.0,
                },
                {
                    "id": "TN_TNJ_KUMBAKONAM_DHARASURAM",
                    "name": "Dharasuram",
                    "name_hi": "दारासुरम",
                    "name_mr": "दारासुरम",
                    "name_ta": "தாராசுரம்",
                    "block_id": "TN_TNJ_KUMBAKONAM",
                    "block_name": "Kumbakonam",
                    "district": "Thanjavur",
                    "state": "Tamil Nadu",
                    "latitude": 10.9582,
                    "longitude": 79.3564,
                    "elevation_mean": 28.0,
                    "elevation_std": 2.0,
                    "slope_mean": 0.5,
                    "aspect_dominant": 90.0,
                    "lulc_class": "cropland",
                    "lulc_cropland_pct": 82.0,
                    "lulc_forest_pct": 3.0,
                    "lulc_urban_pct": 8.0,
                    "lulc_water_pct": 7.0,
                    "soil_type": "alluvial",
                    "ndvi": 0.79,
                    "dist_to_water_km": 0.8,
                    "dist_to_coast_km": 65.0,
                    "nearest_aws_id": "AWS_TN_TNJ_01",
                    "nearest_aws_dist_km": 7.2,
                },
            ]

            for p in panchayats_data:
                db.add(PanchayatModel(**p))

            stations_data = [
                {
                    "id": "AWS_MH_PUNE_01",
                    "name": "Mulshi AWS Station (IMD)",
                    "district": "Pune",
                    "state": "Maharashtra",
                    "latitude": 18.5020,
                    "longitude": 73.5100,
                    "elevation_m": 610.0,
                    "station_type": "AWS",
                },
                {
                    "id": "AWS_MH_NSK_02",
                    "name": "Niphad Agromet Research Station",
                    "district": "Nashik",
                    "state": "Maharashtra",
                    "latitude": 20.1200,
                    "longitude": 74.0200,
                    "elevation_m": 575.0,
                    "station_type": "AWS",
                },
                {
                    "id": "AWS_MP_BPL_01",
                    "name": "Sehore KVK Agromet Station",
                    "district": "Sehore",
                    "state": "Madhya Pradesh",
                    "latitude": 23.1800,
                    "longitude": 77.0500,
                    "elevation_m": 498.0,
                    "station_type": "AWS",
                },
                {
                    "id": "AWS_PB_LDH_01",
                    "name": "PAU Ludhiana Agro-Met Observatory",
                    "district": "Ludhiana",
                    "state": "Punjab",
                    "latitude": 30.9000,
                    "longitude": 75.8000,
                    "elevation_m": 240.0,
                    "station_type": "AWS",
                },
                {
                    "id": "AWS_TN_TNJ_01",
                    "name": "Thanjavur Rice Research AWS",
                    "district": "Thanjavur",
                    "state": "Tamil Nadu",
                    "latitude": 10.8000,
                    "longitude": 79.1500,
                    "elevation_m": 32.0,
                    "station_type": "AWS",
                },
            ]

            for s in stations_data:
                db.add(StationModel(**s))

            db.commit()
            logger.info("Database seed completed successfully.")
    finally:
        db.close()

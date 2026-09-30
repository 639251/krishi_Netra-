"""SQLAlchemy ORM models for KrishiNetra."""
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    DateTime,
    Date,
    Boolean,
    Text,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from .connection import Base

class ApiKeyModel(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    organization = Column(String(200), nullable=True)
    api_key = Column(String(64), unique=True, index=True, nullable=False)
    secret_hash = Column(String(128), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PanchayatModel(Base):
    __tablename__ = "panchayats"

    id = Column(String(50), primary_key=True, index=True)  # e.g., MH_PUNE_MULSHI_TAMHINI
    name = Column(String(100), nullable=False, index=True)
    name_hi = Column(String(100), nullable=True)
    name_mr = Column(String(100), nullable=True)
    name_ta = Column(String(100), nullable=True)
    block_id = Column(String(50), nullable=False, index=True)
    block_name = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_mean = Column(Float, default=500.0)
    elevation_std = Column(Float, default=15.0)
    slope_mean = Column(Float, default=4.0)
    aspect_dominant = Column(Float, default=180.0)
    lulc_class = Column(String(50), default="cropland")
    lulc_cropland_pct = Column(Float, default=70.0)
    lulc_forest_pct = Column(Float, default=15.0)
    lulc_urban_pct = Column(Float, default=5.0)
    lulc_water_pct = Column(Float, default=10.0)
    soil_type = Column(String(50), default="alluvial")
    ndvi = Column(Float, default=0.65)
    dist_to_water_km = Column(Float, default=2.5)
    dist_to_coast_km = Column(Float, default=80.0)
    nearest_aws_id = Column(String(50), nullable=True)
    nearest_aws_dist_km = Column(Float, default=12.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    forecasts = relationship("PanchayatForecastModel", back_populates="panchayat", cascade="all, delete-orphan")
    advisories = relationship("AdvisoryModel", back_populates="panchayat", cascade="all, delete-orphan")

class BlockForecastModel(Base):
    __tablename__ = "block_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    block_id = Column(String(50), nullable=False, index=True)
    forecast_date = Column(Date, nullable=False, index=True)
    issue_datetime = Column(DateTime, default=datetime.utcnow)
    lead_days = Column(Integer, default=1)
    temp_max = Column(Float, nullable=False)
    temp_min = Column(Float, nullable=False)
    rainfall = Column(Float, default=0.0)
    humidity = Column(Float, default=60.0)
    wind_speed = Column(Float, default=10.0)
    wind_direction = Column(Float, default=270.0)
    cloud_cover = Column(Float, default=4.0)
    source = Column(String(50), default="IMD_GFS")

class PanchayatForecastModel(Base):
    __tablename__ = "panchayat_forecasts"

    id = Column(Integer, primary_key=True, index=True)
    panchayat_id = Column(String(50), ForeignKey("panchayats.id"), nullable=False, index=True)
    forecast_date = Column(Date, nullable=False, index=True)
    lead_days = Column(Integer, default=1)
    temp_max = Column(Float, nullable=False)
    temp_min = Column(Float, nullable=False)
    rainfall = Column(Float, default=0.0)
    humidity = Column(Float, default=60.0)
    wind_speed = Column(Float, default=10.0)
    confidence_score = Column(Float, default=0.88)
    temp_lower = Column(Float, nullable=True)
    temp_upper = Column(Float, nullable=True)
    rain_lower = Column(Float, nullable=True)
    rain_upper = Column(Float, nullable=True)
    deviation_temp = Column(Float, default=0.0)
    deviation_rain = Column(Float, default=0.0)
    downscale_reason = Column(String(255), nullable=True)
    model_version = Column(String(50), default="v2.3.1")
    generated_at = Column(DateTime, default=datetime.utcnow)

    panchayat = relationship("PanchayatModel", back_populates="forecasts")

class StationModel(Base):
    __tablename__ = "weather_stations"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, default=500.0)
    station_type = Column(String(50), default="AWS")  # AWS, ARG
    is_active = Column(Boolean, default=True)
    last_ping = Column(DateTime, default=datetime.utcnow)

    readings = relationship("StationReadingModel", back_populates="station", cascade="all, delete-orphan")

class StationReadingModel(Base):
    __tablename__ = "station_readings"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(String(50), ForeignKey("weather_stations.id"), nullable=False, index=True)
    reading_time = Column(DateTime, nullable=False, index=True)
    temp = Column(Float, nullable=True)
    rainfall_1h = Column(Float, nullable=True)
    rainfall_24h = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    wind_dir = Column(Float, nullable=True)
    qc_passed = Column(Boolean, default=True)

    station = relationship("StationModel", back_populates="readings")

class AdvisoryModel(Base):
    __tablename__ = "advisories"

    id = Column(String(64), primary_key=True, index=True)
    panchayat_id = Column(String(50), ForeignKey("panchayats.id"), nullable=False, index=True)
    forecast_date = Column(Date, nullable=False, index=True)
    crop = Column(String(50), nullable=False)
    crop_stage = Column(String(50), nullable=False)
    severity = Column(String(20), default="green")
    action_type = Column(String(50), default="general")
    title_json = Column(JSON, nullable=False)  # {"en": "...", "hi": "...", "mr": "...", "ta": "..."}
    message_json = Column(JSON, nullable=False)
    action_items = Column(JSON, nullable=True)
    scientific_rationale = Column(Text, nullable=True)
    valid_from = Column(DateTime, default=datetime.utcnow)
    valid_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    panchayat = relationship("PanchayatModel", back_populates="advisories")

class FeedbackModel(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    panchayat_id = Column(String(50), nullable=False, index=True)
    date = Column(Date, nullable=False)
    parameter = Column(String(50), nullable=False)
    forecast_value = Column(Float, nullable=False)
    actual_value = Column(Float, nullable=False)
    reporter = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class WebhookModel(Base):
    __tablename__ = "webhooks"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)
    events = Column(JSON, nullable=False)  # ["forecast.new", "alert.severe"]
    panchayat_ids = Column(JSON, nullable=True)
    secret = Column(String(64), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

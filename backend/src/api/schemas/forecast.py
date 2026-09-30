"""Forecast schemas."""
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import date, datetime

class PanchayatMetadata(BaseModel):
    id: str
    name: str
    name_hi: Optional[str] = None
    name_mr: Optional[str] = None
    name_ta: Optional[str] = None
    block: str
    district: str
    state: str
    elevation_m: float
    latitude: float
    longitude: float

class ForecastParameter(BaseModel):
    value: float
    unit: str

class UncertaintyRange(BaseModel):
    lower: float
    upper: float

class SingleForecastDay(BaseModel):
    date: date
    lead_days: int
    parameters: Dict[str, ForecastParameter]
    confidence: float
    uncertainty: Optional[Dict[str, UncertaintyRange]] = None
    block_forecast: Optional[Dict[str, float]] = None

class PanchayatForecastResponse(BaseModel):
    panchayat: PanchayatMetadata
    forecasts: List[SingleForecastDay]
    model_version: str = "v2.3.1"
    generated_at: datetime

class PanchayatComparisonItem(BaseModel):
    panchayat_id: str
    name: str
    elevation_m: float
    temp_max: float
    rainfall: float
    deviation_from_block: Dict[str, float]

class BlockComparisonResponse(BaseModel):
    block: Dict[str, Any]
    block_forecast: Dict[str, Any]
    panchayat_forecasts: List[PanchayatComparisonItem]
    statistics: Dict[str, Any]

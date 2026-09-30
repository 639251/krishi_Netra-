"""Station schemas."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StationReadingSchema(BaseModel):
    reading_time: datetime
    temp: Optional[float] = None
    rainfall_1h: Optional[float] = None
    rainfall_24h: Optional[float] = None
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None
    wind_dir: Optional[float] = None
    qc_passed: bool = True

class StationSchema(BaseModel):
    id: str
    name: str
    district: str
    state: str
    latitude: float
    longitude: float
    elevation_m: float
    station_type: str = "AWS"
    is_active: bool = True
    last_ping: Optional[datetime] = None

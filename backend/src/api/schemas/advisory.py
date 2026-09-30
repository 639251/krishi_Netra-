"""Advisory schemas."""
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import date, datetime

class SingleAdvisoryItem(BaseModel):
    id: str
    severity: str
    crop: str
    crop_stage: str
    action_type: str
    title: str
    message: str
    action_items: Optional[List[str]] = None
    scientific_rationale: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None

class PanchayatAdvisoryResponse(BaseModel):
    panchayat_id: str
    date: date
    weather_summary: Dict[str, Any]
    advisories: List[SingleAdvisoryItem]
    language: str = "en"

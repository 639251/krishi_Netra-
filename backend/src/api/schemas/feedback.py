"""Feedback and Webhook schemas."""
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import date

class FeedbackRequest(BaseModel):
    panchayat_id: str
    date: date
    parameter: str
    forecast_value: float
    actual_value: float
    reporter: Optional[str] = None
    notes: Optional[str] = None

class WebhookRegisterRequest(BaseModel):
    url: str
    events: List[str]  # e.g. ["forecast.new", "alert.severe"]
    panchayat_ids: Optional[List[str]] = None
    secret: Optional[str] = None

"""Data validation utilities."""
from datetime import datetime
import re
from typing import Optional

def validate_iso_date(date_str: str) -> Optional[datetime.date]:
    """Validate and parse YYYY-MM-DD date format."""
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None

def validate_lat_lon(lat: float, lon: float) -> bool:
    """Validate latitude (-90 to 90) and longitude (-180 to 180)."""
    if not (-90.0 <= lat <= 90.0):
        return False
    if not (-180.0 <= lon <= 180.0):
        return False
    return True

def sanitize_panchayat_id(panchayat_id: str) -> str:
    """Sanitize and format Panchayat ID (e.g. MH_PUNE_MULSHI_TAMHINI)."""
    return re.sub(r'[^a-zA-Z0-9_]', '', panchayat_id).upper()

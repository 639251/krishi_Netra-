"""Temporal alignment and Indian Standard Time (IST) normalization."""
from datetime import datetime, date, timezone, timedelta
from typing import Dict, Any

IST = timezone(timedelta(hours=5, minutes=30))

class TemporalAligner:
    """Normalizes UTC model issue times to agricultural day boundaries in IST."""

    @staticmethod
    def to_ist(dt: datetime) -> datetime:
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(IST)

    @staticmethod
    def get_agricultural_season(target_date: date) -> str:
        """
        Determines Indian agricultural crop season:
        - Kharif (Monsoon): June - October
        - Rabi (Winter): November - March
        - Zaid (Summer): April - May
        """
        month = target_date.month
        if 6 <= month <= 10:
            return "kharif"
        elif month >= 11 or month <= 3:
            return "rabi"
        else:
            return "zaid"

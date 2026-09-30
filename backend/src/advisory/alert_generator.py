"""Severity-based alert generator for active warnings."""
from typing import List, Dict, Any
from backend.src.utils.constants import Severity

class AlertGenerator:
    """Generates active banner/push notifications for severe meteorological anomalies."""

    def filter_urgent_alerts(self, advisories: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Extracts ORANGE and RED severity alerts for priority farmer notification."""
        urgent = []
        for adv in advisories:
            if adv.get("severity") in [Severity.ORANGE.value, Severity.RED.value, "warning", "critical"]:
                urgent.append(adv)
        return urgent

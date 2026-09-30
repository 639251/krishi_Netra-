"""NBSS&LUP Soil Database Processor."""
from typing import Dict, Any

class SoilProcessor:
    """Processes Indian soil types and estimates water retention capacity & thermal conductivity."""

    SOIL_PROPERTIES: Dict[str, Dict[str, float]] = {
        "alluvial": {"water_retention": 0.65, "thermal_capacity": 0.70, "drainage_rate": 0.55},
        "black_cotton": {"water_retention": 0.85, "thermal_capacity": 0.80, "drainage_rate": 0.30},
        "red_laterite": {"water_retention": 0.50, "thermal_capacity": 0.60, "drainage_rate": 0.75},
        "desert_sandy": {"water_retention": 0.25, "thermal_capacity": 0.40, "drainage_rate": 0.95},
        "mountain": {"water_retention": 0.45, "thermal_capacity": 0.50, "drainage_rate": 0.80},
        "saline_alkaline": {"water_retention": 0.55, "thermal_capacity": 0.65, "drainage_rate": 0.40},
    }

    def get_soil_properties(self, soil_type: str) -> Dict[str, float]:
        norm = soil_type.lower().replace(" ", "_")
        return self.SOIL_PROPERTIES.get(norm, self.SOIL_PROPERTIES["alluvial"])

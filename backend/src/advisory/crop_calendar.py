"""Crop Calendar and Phenological Stage Lookup."""
from datetime import date
from typing import Dict, Any, Optional
from backend.src.utils.constants import CropType, CropStage

class CropCalendar:
    """
    Maintains phenological stages and critical agro-met vulnerability windows
    for major Indian crops across Kharif, Rabi, and Zaid seasons.
    """

    CROP_STAGES: Dict[str, Dict[str, Any]] = {
        "rice": {
            "critical_water_stages": [CropStage.FLOWERING, CropStage.GRAIN_FILLING],
            "optimal_temp_range": (22.0, 32.0),
            "rain_sensitivity_stage": CropStage.FLOWERING,
            "max_wind_speed_kmh": 30.0,
        },
        "wheat": {
            "critical_water_stages": [CropStage.GERMINATION, CropStage.GRAIN_FILLING],
            "optimal_temp_range": (15.0, 25.0),
            "rain_sensitivity_stage": CropStage.HARVEST,
            "max_wind_speed_kmh": 25.0,
        },
        "cotton": {
            "critical_water_stages": [CropStage.VEGETATIVE, CropStage.FLOWERING],
            "optimal_temp_range": (24.0, 35.0),
            "rain_sensitivity_stage": CropStage.MATURITY,
            "max_wind_speed_kmh": 35.0,
        },
        "soybean": {
            "critical_water_stages": [CropStage.FLOWERING, CropStage.GRAIN_FILLING],
            "optimal_temp_range": (20.0, 30.0),
            "rain_sensitivity_stage": CropStage.HARVEST,
            "max_wind_speed_kmh": 28.0,
        },
        "grapes": {
            "critical_water_stages": [CropStage.FLOWERING, CropStage.GRAIN_FILLING],
            "optimal_temp_range": (18.0, 32.0),
            "rain_sensitivity_stage": CropStage.FLOWERING,
            "max_wind_speed_kmh": 20.0,
        },
        "sugarcane": {
            "critical_water_stages": [CropStage.VEGETATIVE],
            "optimal_temp_range": (25.0, 38.0),
            "rain_sensitivity_stage": CropStage.HARVEST,
            "max_wind_speed_kmh": 40.0,
        },
        "onion": {
            "critical_water_stages": [CropStage.VEGETATIVE, CropStage.GRAIN_FILLING],
            "optimal_temp_range": (18.0, 30.0),
            "rain_sensitivity_stage": CropStage.HARVEST,
            "max_wind_speed_kmh": 25.0,
        },
        "mustard": {
            "critical_water_stages": [CropStage.FLOWERING],
            "optimal_temp_range": (12.0, 25.0),
            "rain_sensitivity_stage": CropStage.FLOWERING,
            "max_wind_speed_kmh": 22.0,
        },
    }

    def get_crop_profile(self, crop_name: str) -> Dict[str, Any]:
        norm = crop_name.lower().split()[0].replace("(", "").replace(")", "")
        return self.CROP_STAGES.get(norm, self.CROP_STAGES["rice"])

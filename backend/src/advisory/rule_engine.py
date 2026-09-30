"""Weather to Agricultural Action Rule Engine."""
from typing import Dict, Any, List, Optional
from datetime import datetime, date
import uuid
from .crop_calendar import CropCalendar
from .nlg.template_engine import MultiLingualNLG
from backend.src.utils.constants import Severity, ActionType, CropStage

class AdvisoryRuleEngine:
    """
    Evaluates micro-climate weather forecasts against crop physiological thresholds
    to generate targeted, high-impact advisories.
    """

    def __init__(self):
        self.crop_calendar = CropCalendar()
        self.nlg = MultiLingualNLG()

    def generate_advisories(
        self,
        panchayat_id: str,
        forecast_date: date,
        weather: Dict[str, float],
        crop: str = "Rice",
        crop_stage: str = "Flowering & Tillering",
    ) -> List[Dict[str, Any]]:
        advisories = []
        t_max = weather.get("temp_max", 30.0)
        t_min = weather.get("temp_min", 22.0)
        rain = weather.get("rainfall", 0.0)
        rh = weather.get("humidity", 65.0)
        wind = weather.get("wind_speed", 10.0)

        template_params = {
            "crop": crop,
            "stage": crop_stage,
            "temp_max": t_max,
            "temp_min": t_min,
            "rainfall": rain,
            "humidity": rh,
            "wind_speed": wind,
        }

        # Rule 1: Heavy Rain during critical stage
        is_flowering = "flower" in crop_stage.lower() or "tillering" in crop_stage.lower()
        if rain >= 20.0:
            rendered = self.nlg.render_all_languages("heavy_rain_flowering", template_params)
            advisories.append({
                "id": f"adv_{panchayat_id}_{forecast_date}_rain",
                "panchayat_id": panchayat_id,
                "forecast_date": forecast_date,
                "crop": crop,
                "crop_stage": crop_stage,
                "severity": Severity.ORANGE.value if is_flowering else Severity.YELLOW.value,
                "action_type": ActionType.HARVESTING.value if "harvest" in crop_stage.lower() else ActionType.PROTECTION.value,
                "title": {lang: rendered[lang]["title"] for lang in rendered},
                "message": {lang: rendered[lang]["message"] for lang in rendered},
                "action_items": rendered["en"]["action_items"],
                "scientific_rationale": f"Rainfall of {rain}mm exceeds 24-hr threshold for {crop_stage}. Drainage is critical to avoid root anoxia and fungal sporulation.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow()).isoformat(),
            })

        # Rule 2: Heat stress
        if t_max >= 38.0 and rh <= 40.0:
            rendered = self.nlg.render_all_languages("heat_wave", template_params)
            advisories.append({
                "id": f"adv_{panchayat_id}_{forecast_date}_heat",
                "panchayat_id": panchayat_id,
                "forecast_date": forecast_date,
                "crop": crop,
                "crop_stage": crop_stage,
                "severity": Severity.RED.value if t_max >= 41.0 else Severity.ORANGE.value,
                "action_type": ActionType.IRRIGATION.value,
                "title": {lang: rendered[lang]["title"] for lang in rendered},
                "message": {lang: rendered[lang]["message"] for lang in rendered},
                "action_items": rendered["en"]["action_items"],
                "scientific_rationale": f"Vapor pressure deficit spikes when temp exceeds 38°C with RH < 40%. Plant stomata close, impairing photosynthesis unless micro-irrigation is supplied.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow()).isoformat(),
            })

        # Rule 3: High humidity fungal pest risk
        if rh >= 80.0 and rain < 5.0 and t_max >= 26.0:
            rendered = self.nlg.render_all_languages("pest_disease_risk", template_params)
            advisories.append({
                "id": f"adv_{panchayat_id}_{forecast_date}_pest",
                "panchayat_id": panchayat_id,
                "forecast_date": forecast_date,
                "crop": crop,
                "crop_stage": crop_stage,
                "severity": Severity.YELLOW.value,
                "action_type": ActionType.PEST_MANAGEMENT.value,
                "title": {lang: rendered[lang]["title"] for lang in rendered},
                "message": {lang: rendered[lang]["message"] for lang in rendered},
                "action_items": rendered["en"]["action_items"],
                "scientific_rationale": f"Leaf wetness duration and high relative humidity ({rh}%) create ideal spore germination temperature window for fungi (Pyricularia oryzae / Alternaria).",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow()).isoformat(),
            })

        # Rule 4: Optimal Spray Window
        if wind <= 14.0 and rain <= 2.0 and 45.0 <= rh <= 75.0:
            rendered = self.nlg.render_all_languages("optimal_spray", template_params)
            advisories.append({
                "id": f"adv_{panchayat_id}_{forecast_date}_spray",
                "panchayat_id": panchayat_id,
                "forecast_date": forecast_date,
                "crop": crop,
                "crop_stage": crop_stage,
                "severity": Severity.GREEN.value,
                "action_type": ActionType.SPRAYING.value,
                "title": {lang: rendered[lang]["title"] for lang in rendered},
                "message": {lang: rendered[lang]["message"] for lang in rendered},
                "action_items": rendered["en"]["action_items"],
                "scientific_rationale": f"Low wind drift velocity (< 15 km/h) ensures high droplet deposition efficiency with zero chemical runoff loss.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow()).isoformat(),
            })

        # Fallback if no specific trigger fired
        if not advisories:
            rendered = self.nlg.render_all_languages("normal_conditions", template_params)
            advisories.append({
                "id": f"adv_{panchayat_id}_{forecast_date}_norm",
                "panchayat_id": panchayat_id,
                "forecast_date": forecast_date,
                "crop": crop,
                "crop_stage": crop_stage,
                "severity": Severity.GREEN.value,
                "action_type": ActionType.FERTILIZATION.value,
                "title": {lang: rendered[lang]["title"] for lang in rendered},
                "message": {lang: rendered[lang]["message"] for lang in rendered},
                "action_items": rendered["en"]["action_items"],
                "scientific_rationale": "Weather parameters are within normal physiological range.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow()).isoformat(),
            })

        return advisories

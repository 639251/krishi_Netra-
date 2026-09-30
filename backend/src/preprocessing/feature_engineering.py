"""Feature Engineering Pipeline for AI Downscaling."""
import math
import numpy as np
from datetime import date
from typing import Dict, Any, List, Union
from backend.src.utils.geo_utils import compute_aspect_components, calculate_orographic_enhancement
from backend.src.utils.constants import STANDARD_LAPSE_RATE

class FeatureEngineer:
    """
    Transforms raw block forecasts and static Panchayat geo-covariates into ML feature vectors.
    """

    FEATURE_NAMES = [
        "block_temp_max",
        "block_temp_min",
        "block_rainfall",
        "block_humidity",
        "block_wind_speed",
        "block_wind_direction",
        "block_cloud_cover",
        "elevation",
        "elevation_anomaly",
        "temp_lapse_estimate",
        "slope",
        "aspect_sin",
        "aspect_cos",
        "rain_orographic_factor",
        "lulc_cropland",
        "lulc_forest",
        "lulc_urban",
        "lulc_water",
        "ndvi",
        "dist_to_water",
        "dist_to_coast",
        "day_of_year",
        "lat",
        "lon",
    ]

    def __init__(self, lapse_rate: float = STANDARD_LAPSE_RATE):
        self.lapse_rate = lapse_rate

    def create_features(
        self,
        block_forecast: Dict[str, Any],
        panchayat_meta: Dict[str, Any],
        block_mean_elevation: float = 450.0,
    ) -> np.ndarray:
        """
        Creates a 1D numpy feature vector for a specific Panchayat and Forecast instance.
        """
        elev = float(panchayat_meta.get("elevation_mean", 500.0))
        elev_anomaly = elev - block_mean_elevation
        lapse_estimate = (elev_anomaly * self.lapse_rate) / 1000.0

        slope = float(panchayat_meta.get("slope_mean", 4.0))
        aspect = float(panchayat_meta.get("aspect_dominant", 180.0))
        aspect_sin, aspect_cos = compute_aspect_components(aspect)

        wind_dir = float(block_forecast.get("wind_direction", 270.0))
        wind_spd = float(block_forecast.get("wind_speed", 12.0))
        orographic_factor = calculate_orographic_enhancement(slope, aspect, wind_dir, wind_spd)

        fc_date = block_forecast.get("forecast_date")
        if isinstance(fc_date, str):
            fc_date = date.fromisoformat(fc_date)
        elif not isinstance(fc_date, date):
            fc_date = date.today()

        day_of_year = fc_date.timetuple().tm_yday

        features = [
            float(block_forecast.get("temp_max", 32.0)),
            float(block_forecast.get("temp_min", 24.0)),
            float(block_forecast.get("rainfall", 0.0)),
            float(block_forecast.get("humidity", 65.0)),
            float(block_forecast.get("wind_speed", 10.0)),
            float(block_forecast.get("wind_direction", 270.0)),
            float(block_forecast.get("cloud_cover", 4.0)),
            elev,
            elev_anomaly,
            lapse_estimate,
            slope,
            aspect_sin,
            aspect_cos,
            orographic_factor,
            float(panchayat_meta.get("lulc_cropland_pct", 70.0)) / 100.0,
            float(panchayat_meta.get("lulc_forest_pct", 15.0)) / 100.0,
            float(panchayat_meta.get("lulc_urban_pct", 5.0)) / 100.0,
            float(panchayat_meta.get("lulc_water_pct", 10.0)) / 100.0,
            float(panchayat_meta.get("ndvi", 0.65)),
            float(panchayat_meta.get("dist_to_water_km", 2.5)),
            float(panchayat_meta.get("dist_to_coast_km", 80.0)),
            float(day_of_year),
            float(panchayat_meta.get("latitude", 18.5)),
            float(panchayat_meta.get("longitude", 73.5)),
        ]

        return np.array(features, dtype=np.float32)

    def get_feature_names(self) -> List[str]:
        return self.FEATURE_NAMES

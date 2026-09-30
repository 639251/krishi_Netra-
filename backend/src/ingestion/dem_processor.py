"""SRTM 30m Digital Elevation Model (DEM) Processor."""
import numpy as np
from typing import Dict, Any

class DEMProcessor:
    """Processes elevation rasters to extract zonal terrain parameters."""

    def __init__(self, lapse_rate: float = -6.5):
        self.lapse_rate = lapse_rate  # °C per 1000m

    def compute_terrain_metrics(
        self,
        elevation_mean: float,
        block_mean_elevation: float,
        slope_mean: float,
        aspect_dominant: float,
    ) -> Dict[str, float]:
        """
        Calculates elevation anomaly, lapse rate delta, and terrain ruggedness index (TRI).
        """
        elevation_anomaly = elevation_mean - block_mean_elevation
        # Temperature lapse estimate in °C
        temp_lapse_adjustment = (elevation_anomaly * self.lapse_rate) / 1000.0

        # Approximate TRI based on slope and standard deviation
        tri = float(slope_mean * 1.85)

        return {
            "elevation_mean": elevation_mean,
            "elevation_anomaly": round(elevation_anomaly, 2),
            "temp_lapse_adjustment": round(temp_lapse_adjustment, 2),
            "slope_mean": slope_mean,
            "aspect_dominant": aspect_dominant,
            "ruggedness_index": round(tri, 2),
        }

"""Spatial alignment, coordinate re-projection, and grid resampling."""
from typing import Tuple, List, Dict, Any
import numpy as np
from backend.src.utils.geo_utils import haversine_distance, idw_interpolation

class SpatialAligner:
    """Aligns heterogenous geospatial rasters and points to a 1 km x 1 km EPSG:4326 grid."""

    def __init__(self, target_crs: str = "EPSG:4326", grid_res_km: float = 1.0):
        self.target_crs = target_crs
        self.grid_res_km = grid_res_km

    def interpolate_point(
        self,
        lat: float,
        lon: float,
        station_points: List[Tuple[float, float, float]],
    ) -> float:
        """Interpolates value at point (lat, lon) from station network using IDW."""
        return idw_interpolation(lat, lon, station_points, power=2.0)

    def compute_grid_indices(self, lat: float, lon: float) -> Tuple[int, int]:
        """Convert lat/lon coordinate into standard 0.01 degree (~1km) grid indices."""
        grid_lat = int(round((lat - 8.0) * 100))
        grid_lon = int(round((lon - 68.0) * 100))
        return grid_lat, grid_lon

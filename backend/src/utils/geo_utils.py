"""Geospatial mathematical and geometric utilities."""
import math
from typing import List, Tuple, Dict, Any
import numpy as np

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on the Earth in kilometers.
    """
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def idw_interpolation(
    target_lat: float,
    target_lon: float,
    known_points: List[Tuple[float, float, float]],
    power: float = 2.0,
    max_radius_km: float = 100.0,
) -> float:
    """
    Inverse Distance Weighting (IDW) interpolation.
    known_points: List of (lat, lon, value)
    """
    if not known_points:
        return 0.0

    weights = []
    values = []

    for lat, lon, val in known_points:
        dist = haversine_distance(target_lat, target_lon, lat, lon)
        if dist < 0.001:  # Exact hit
            return val
        if dist <= max_radius_km:
            w = 1.0 / (dist ** power)
            weights.append(w)
            values.append(val)

    if not weights:
        # Fallback to nearest point
        nearest = min(
            known_points,
            key=lambda p: haversine_distance(target_lat, target_lon, p[0], p[1]),
        )
        return nearest[2]

    return float(np.sum(np.array(weights) * np.array(values)) / np.sum(weights))

def compute_aspect_components(aspect_degrees: float) -> Tuple[float, float]:
    """Return circular encoding sin(aspect) and cos(aspect)."""
    rad = math.radians(aspect_degrees)
    return math.sin(rad), math.cos(rad)

def calculate_orographic_enhancement(
    slope_deg: float,
    aspect_deg: float,
    wind_direction_deg: float,
    wind_speed_kmh: float,
) -> float:
    """
    Compute orographic rainfall factor: wind hitting upslopes forces air upwards,
    increasing local condensation.
    """
    wind_rad = math.radians(wind_direction_deg)
    aspect_rad = math.radians(aspect_deg)
    # Wind angle relative to slope facing direction
    alignment = max(0.0, math.cos(wind_rad - aspect_rad))
    # Factor increases with slope steepness and wind speed
    orographic_factor = (slope_deg / 10.0) * alignment * (wind_speed_kmh / 20.0)
    return float(np.clip(orographic_factor, 0.0, 3.0))

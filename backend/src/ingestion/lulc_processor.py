"""ISRO Bhuvan Land Use / Land Cover (LULC) Processor."""
from typing import Dict, Any

class LULCProcessor:
    """Processes land use and land cover percentages for downscaling energy/water balance."""

    def compute_thermal_inertia_factor(
        self,
        cropland_pct: float,
        forest_pct: float,
        urban_pct: float,
        water_pct: float,
    ) -> float:
        """
        Calculates thermal inertia & evapotranspiration cooling influence.
        Water bodies and dense forests dampen diurnal temperature swings.
        Urban built-up areas cause micro heat-island effects.
        """
        cooling_index = (forest_pct * 0.02 + water_pct * 0.04) - (urban_pct * 0.03)
        return round(cooling_index, 3)

"""Quality Control & Anomaly Detection Pipeline."""
import numpy as np
from typing import Dict, Any, Tuple
from backend.src.utils.constants import PHYSICAL_BOUNDS
from backend.src.utils.logger import logger

class QualityController:
    """Performs statistical range checking and physics-consistency checks on meteorological feeds."""

    def validate_reading(self, parameter: str, value: float) -> Tuple[bool, float]:
        """
        Validates value against physical boundaries and clips unrealistic spikes.
        """
        if parameter in PHYSICAL_BOUNDS:
            lo, hi = PHYSICAL_BOUNDS[parameter]
            if value < lo or value > hi:
                logger.warning(f"QC Anomaly: {parameter} value {value} out of range [{lo}, {hi}]. Clipping.")
                clipped = float(np.clip(value, lo, hi))
                return False, clipped
        return True, value

    def check_diurnal_consistency(self, temp_max: float, temp_min: float) -> Tuple[float, float]:
        """Ensures temp_max >= temp_min with minimum diurnal temperature range (DTR >= 1.0°C)."""
        if temp_max < temp_min:
            logger.warning(f"Inverted temperature range: Max={temp_max} < Min={temp_min}. Swapping.")
            temp_max, temp_min = temp_min, temp_max
        if (temp_max - temp_min) < 1.0:
            temp_max = temp_min + 1.5
        return temp_max, temp_min

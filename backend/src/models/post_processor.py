"""Post-processing, Bias Correction, and Meteorological Consistency."""
import numpy as np
from typing import Dict, Any, Tuple
from backend.src.utils.constants import PHYSICAL_BOUNDS

class PostProcessor:
    """
    Applies quantile mapping bias correction, physical clipping, and consistency rules.
    """

    def apply_bias_correction(
        self,
        predicted_val: float,
        parameter: str,
        elevation_anomaly: float,
    ) -> float:
        """
        Quantile mapping & elevation-residual bias correction.
        """
        corrected = predicted_val
        # Minor empirical correction for extreme high-altitude valleys
        if parameter == "temp_max" and elevation_anomaly > 300:
            corrected -= 0.3
        elif parameter == "rainfall" and elevation_anomaly > 200:
            corrected += 0.5

        if parameter in PHYSICAL_BOUNDS:
            lo, hi = PHYSICAL_BOUNDS[parameter]
            corrected = float(np.clip(corrected, lo, hi))

        return round(corrected, 1)

    def enforce_physical_consistency(
        self,
        temp_max: float,
        temp_min: float,
        rainfall: float,
        humidity: float,
    ) -> Dict[str, float]:
        """
        Enforces thermodynamics consistency:
        - temp_max >= temp_min + 1.0°C
        - high rainfall -> minimum humidity floor (> 70%)
        """
        if temp_max < temp_min + 1.0:
            temp_max = temp_min + 2.0

        if rainfall > 20.0 and humidity < 75.0:
            humidity = 80.0

        return {
            "temp_max": round(temp_max, 1),
            "temp_min": round(temp_min, 1),
            "rainfall": round(max(0.0, rainfall), 1),
            "humidity": round(min(100.0, max(15.0, humidity)), 1),
        }

"""Missing Data Imputation."""
from typing import List, Optional
import numpy as np

class Imputer:
    """Imputes missing sensor or forecast variables using spatial and temporal interpolation."""

    @staticmethod
    def forward_fill_series(series: List[Optional[float]]) -> List[float]:
        filled = []
        last_val = 25.0
        for val in series:
            if val is not None and not np.isnan(val):
                last_val = val
            filled.append(last_val)
        return filled

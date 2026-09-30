"""Random Forest Downscaling Regressor."""
from typing import Dict, Any, List
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from .base_model import BaseDownscaler
from backend.src.utils.logger import logger

class RFDownscaler(BaseDownscaler):
    """
    Random Forest Regressor specialized for non-linear temperature and humidity micro-climates.
    """

    def __init__(
        self,
        parameter_name: str = "temp_max",
        n_estimators: int = 150,
        max_depth: int = 14,
        random_state: int = 42,
    ):
        super().__init__(parameter_name)
        self.model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_split=4,
            min_samples_leaf=2,
            n_jobs=-1,
            random_state=random_state,
        )

    def train(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        logger.info(f"Training RFDownscaler for {self.parameter_name} with {X.shape[0]} samples")
        self.model.fit(X, y)
        self.is_trained = True

        y_pred = self.model.predict(X)
        rmse = float(np.sqrt(mean_squared_error(y, y_pred)))
        mae = float(mean_absolute_error(y, y_pred))
        r2 = float(r2_score(y, y_pred))

        return {"rmse": round(rmse, 3), "mae": round(mae, 3), "r2": round(r2, 3)}

    def predict(self, X: np.ndarray) -> np.ndarray:
        if not self.is_trained:
            # Fallback heuristic calculation if not yet trained
            if self.parameter_name == "temp_max":
                # lapse rate (idx 9) + block temp (idx 0)
                return X[:, 0] + X[:, 9]
            elif self.parameter_name == "rainfall":
                return np.maximum(0.0, X[:, 2] + X[:, 13] * 2.0)
            return X[:, 0]
        if X.ndim == 1:
            X = X.reshape(1, -1)
        return self.model.predict(X)

    def get_feature_importance(self) -> Dict[str, float]:
        if not self.is_trained:
            return {}
        importances = self.model.feature_importances_
        return {f"feat_{i}": float(v) for i, v in enumerate(importances)}

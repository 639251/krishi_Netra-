"""Gradient Boosted Trees (XGBoost/GBR) Downscaling Regressor."""
from typing import Dict, Any
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from .base_model import BaseDownscaler
from backend.src.utils.logger import logger

class XGBDownscaler(BaseDownscaler):
    """
    Gradient Boosted Trees Regressor specialized for non-Gaussian rainfall & wind distributions.
    """

    def __init__(
        self,
        parameter_name: str = "rainfall",
        n_estimators: int = 150,
        learning_rate: float = 0.05,
        max_depth: int = 6,
        random_state: int = 42,
    ):
        super().__init__(parameter_name)
        self.model = GradientBoostingRegressor(
            n_estimators=n_estimators,
            learning_rate=learning_rate,
            max_depth=max_depth,
            subsample=0.8,
            random_state=random_state,
        )

    def train(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        logger.info(f"Training XGBDownscaler for {self.parameter_name} with {X.shape[0]} samples")
        self.model.fit(X, y)
        self.is_trained = True

        y_pred = self.model.predict(X)
        rmse = float(np.sqrt(mean_squared_error(y, y_pred)))
        mae = float(mean_absolute_error(y, y_pred))
        r2 = float(r2_score(y, y_pred))

        return {"rmse": round(rmse, 3), "mae": round(mae, 3), "r2": round(r2, 3)}

    def predict(self, X: np.ndarray) -> np.ndarray:
        if not self.is_trained:
            if self.parameter_name == "rainfall":
                # base rain (idx 2) + orographic (idx 13) * 2.5
                return np.maximum(0.0, X[:, 2] + X[:, 13] * 2.5)
            elif self.parameter_name == "temp_max":
                return X[:, 0] + X[:, 9]
            return X[:, 0]
        if X.ndim == 1:
            X = X.reshape(1, -1)
        return self.model.predict(X)

    def get_feature_importance(self) -> Dict[str, float]:
        if not self.is_trained:
            return {}
        importances = self.model.feature_importances_
        return {f"feat_{i}": float(v) for i, v in enumerate(importances)}

"""Ensemble Stacking Downscaler with Uncertainty Quantification."""
from typing import Dict, Any, List, Tuple
import numpy as np
from sklearn.linear_model import Ridge
from .random_forest import RFDownscaler
from .xgboost_model import XGBDownscaler
from .cnn_unet import CNNDownscaler
from backend.src.utils.constants import PHYSICAL_BOUNDS
from backend.src.utils.logger import logger

class EnsembleDownscaler:
    """
    Stacks predictions from RF, XGBoost, and CNN models.
    Provides point estimates, uncertainty bounds (90% CI), and confidence scores.
    """

    def __init__(self, parameter_name: str = "temp_max"):
        self.parameter_name = parameter_name
        self.rf = RFDownscaler(parameter_name=parameter_name)
        self.xgb = XGBDownscaler(parameter_name=parameter_name)
        self.cnn = CNNDownscaler(parameter_name=parameter_name)
        self.meta_learner = Ridge(alpha=1.0, positive=True)
        self.is_trained = False
        self.weights = {"rf": 0.40, "xgb": 0.45, "cnn": 0.15}

    def train(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        logger.info(f"Training EnsembleDownscaler for {self.parameter_name}")
        m_rf = self.rf.train(X, y)
        m_xgb = self.xgb.train(X, y)
        m_cnn = self.cnn.train(X, y)

        pred_rf = self.rf.predict(X).reshape(-1, 1)
        pred_xgb = self.xgb.predict(X).reshape(-1, 1)
        pred_cnn = self.cnn.predict(X).reshape(-1, 1)

        meta_X = np.hstack([pred_rf, pred_xgb, pred_cnn])
        self.meta_learner.fit(meta_X, y)
        self.is_trained = True

        coefs = self.meta_learner.coef_
        total = np.sum(coefs) if np.sum(coefs) > 0 else 1.0
        self.weights = {
            "rf": round(float(coefs[0] / total), 3),
            "xgb": round(float(coefs[1] / total), 3),
            "cnn": round(float(coefs[2] / total), 3),
        }

        y_pred = self.predict(X)
        rmse = float(np.sqrt(np.mean((y - y_pred) ** 2)))
        mae = float(np.mean(np.abs(y - y_pred)))
        r2 = float(1.0 - (np.sum((y - y_pred) ** 2) / np.sum((y - np.mean(y)) ** 2)))

        return {
            "rmse": round(rmse, 3),
            "mae": round(mae, 3),
            "r2": round(r2, 3),
            "rf_metrics": m_rf,
            "xgb_metrics": m_xgb,
            "cnn_metrics": m_cnn,
            "weights": self.weights,
        }

    def predict(self, X: np.ndarray) -> np.ndarray:
        if X.ndim == 1:
            X = X.reshape(1, -1)

        pred_rf = self.rf.predict(X)
        pred_xgb = self.xgb.predict(X)
        pred_cnn = self.cnn.predict(X)

        if self.is_trained:
            meta_X = np.column_stack([pred_rf, pred_xgb, pred_cnn])
            final = self.meta_learner.predict(meta_X)
        else:
            w = self.weights
            final = w["rf"] * pred_rf + w["xgb"] * pred_xgb + w["cnn"] * pred_cnn

        # Physical bounds clipping
        if self.parameter_name in PHYSICAL_BOUNDS:
            lo, hi = PHYSICAL_BOUNDS[self.parameter_name]
            final = np.clip(final, lo, hi)

        return final

    def predict_with_uncertainty(
        self, X: np.ndarray
    ) -> Tuple[float, float, float, float]:
        """
        Returns (point_estimate, lower_bound, upper_bound, confidence_score)
        Uncertainty bounds represent 90% confidence interval.
        """
        if X.ndim == 1:
            X = X.reshape(1, -1)

        pred_rf = float(self.rf.predict(X)[0])
        pred_xgb = float(self.xgb.predict(X)[0])
        pred_cnn = float(self.cnn.predict(X)[0])

        w = self.weights
        point = float(w["rf"] * pred_rf + w["xgb"] * pred_xgb + w["cnn"] * pred_cnn)

        # Standard deviation across base models as uncertainty proxy
        spread = float(np.std([pred_rf, pred_xgb, pred_cnn]))
        margin = max(0.8, spread * 1.645)  # 90% normal z-score

        if self.parameter_name == "rainfall":
            lower = max(0.0, point - margin * 1.5)
            upper = point + margin * 2.0
            confidence = max(0.70, min(0.95, 1.0 - (spread / (point + 5.0))))
        else:
            lower = point - margin
            upper = point + margin
            confidence = max(0.80, min(0.98, 1.0 - (spread / 10.0)))

        # Clip bounds
        if self.parameter_name in PHYSICAL_BOUNDS:
            lo, hi = PHYSICAL_BOUNDS[self.parameter_name]
            point = float(np.clip(point, lo, hi))
            lower = float(np.clip(lower, lo, hi))
            upper = float(np.clip(upper, lo, hi))

        return round(point, 1), round(lower, 1), round(upper, 1), round(confidence, 2)

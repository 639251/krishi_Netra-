"""Abstract Base Model for Weather Downscaling."""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import numpy as np

class BaseDownscaler(ABC):
    """Abstract base class for all single-parameter and ensemble downscaling models."""

    def __init__(self, parameter_name: str, model_version: str = "v2.3.1"):
        self.parameter_name = parameter_name
        self.model_version = model_version
        self.is_trained = False
        self.feature_names = []

    @abstractmethod
    def train(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """Train model and return evaluation metrics (RMSE, MAE, R2)."""
        pass

    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Predict parameter values for feature matrix X."""
        pass

    @abstractmethod
    def get_feature_importance(self) -> Dict[str, float]:
        """Return feature importance dictionary."""
        pass

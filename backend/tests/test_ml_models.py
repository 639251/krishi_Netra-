"""Test suite for ML Downscaling Models & Preprocessing."""
import pytest
import numpy as np
from backend.src.preprocessing.feature_engineering import FeatureEngineer
from backend.src.models.ensemble import EnsembleDownscaler
from backend.src.models.trainer import ModelTrainer
from backend.src.utils.geo_utils import haversine_distance, calculate_orographic_enhancement

def test_haversine_distance():
    # Distance between Pune and Mumbai (~120 km)
    dist = haversine_distance(18.5204, 73.8567, 19.0760, 72.8777)
    assert 110.0 <= dist <= 135.0

def test_orographic_enhancement():
    # Wind hitting slope directly (alignment = 1.0)
    factor = calculate_orographic_enhancement(slope_deg=15.0, aspect_deg=270.0, wind_direction_deg=270.0, wind_speed_kmh=20.0)
    assert factor > 1.0

def test_feature_engineering_shape():
    fe = FeatureEngineer()
    bfc = {"temp_max": 32.0, "temp_min": 22.0, "rainfall": 10.0, "humidity": 70.0, "wind_speed": 12.0}
    pmeta = {"elevation_mean": 650.0, "slope_mean": 12.0, "aspect_dominant": 260.0}
    fvec = fe.create_features(bfc, pmeta)
    assert len(fvec) == 24
    assert isinstance(fvec, np.ndarray)

def test_ensemble_model_training_and_prediction():
    trainer = ModelTrainer()
    metrics = trainer.train_all_models()
    assert metrics["temp_max"]["r2"] > 0.85
    assert metrics["rainfall"]["rmse"] < 5.0

    X_dummy = np.ones((1, 24), dtype=np.float32)
    point, low, up, conf = trainer.temp_model.predict_with_uncertainty(X_dummy)
    assert low <= point <= up
    assert 0.70 <= conf <= 1.0

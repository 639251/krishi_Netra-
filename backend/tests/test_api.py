"""Test suite for FastAPI REST API endpoints."""
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.src.api.main import app
from backend.src.api.dependencies import seed_initial_data_if_empty

# Seed test database
seed_initial_data_if_empty()

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "components" in data
    assert data["components"]["ml_model"] == "healthy"

def test_v1_health_endpoint():
    response = client.get("/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_list_stations():
    response = client.get("/v1/stations")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]) >= 5

def test_search_panchayats():
    response = client.get("/v1/search/panchayat?q=Tamhini")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["total"] >= 1
    assert data["data"]["results"][0]["id"] == "MH_PUNE_MULSHI_TAMHINI"

def test_get_panchayat_forecast():
    response = client.get("/v1/forecast/MH_PUNE_MULSHI_TAMHINI?days=3&include_uncertainty=true&include_block=true")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["panchayat"]["name"] == "Tamhini Ghat"
    assert len(data["data"]["forecasts"]) == 3
    first_day = data["data"]["forecasts"][0]
    assert "temp_max" in first_day["parameters"]
    assert "rainfall" in first_day["parameters"]
    assert first_day["uncertainty"] is not None

def test_get_panchayat_advisory():
    response = client.get("/v1/advisory/MH_PUNE_MULSHI_TAMHINI?crop=Rice&language=hi")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["language"] == "hi"
    assert len(data["data"]["advisories"]) >= 1

def test_block_comparison():
    response = client.get("/v1/compare/MH_PUNE_MULSHI?parameter=temp_max")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["data"]["panchayats"]) >= 2
    assert "variance_summary" in data["data"]

def test_admin_model_status():
    response = client.get("/v1/admin/model/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["metrics"]["overall_r2"] > 0.90

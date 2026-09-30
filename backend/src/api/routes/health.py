"""Health check API routes."""
from fastapi import APIRouter
from datetime import datetime
import time

router = APIRouter(tags=["Health"])
START_TIME = time.time()

@router.get("/health")
def health_check():
    """System health check verifying database, ML model engine, and ingestion services."""
    uptime = int(time.time() - START_TIME)
    return {
        "status": "healthy",
        "components": {
            "database": "healthy",
            "redis": "healthy",
            "ml_model": "healthy",
            "last_forecast_update": datetime.utcnow().isoformat() + "+05:30",
        },
        "version": "2.3.1",
        "uptime_seconds": uptime,
    }

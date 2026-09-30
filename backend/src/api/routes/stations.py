"""Weather Stations API routes."""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, List

from backend.src.db.connection import get_db
from backend.src.db.repositories import StationRepository
from backend.src.ingestion.aws_fetcher import AWSStationFetcher
from backend.src.api.schemas.station import StationSchema, StationReadingSchema
from backend.src.api.schemas.common import ApiResponse

router = APIRouter(tags=["Weather Stations"])
aws_fetcher = AWSStationFetcher()

@router.get("/stations", response_model=ApiResponse)
def list_stations(db: Session = Depends(get_db)):
    """List all Automatic Weather Stations (AWS) with location and station metadata."""
    s_repo = StationRepository(db)
    stations = s_repo.get_all()
    res = [
        StationSchema(
            id=s.id,
            name=s.name,
            district=s.district,
            state=s.state,
            latitude=s.latitude,
            longitude=s.longitude,
            elevation_m=s.elevation_m,
            station_type=s.station_type,
            is_active=s.is_active,
            last_ping=s.last_ping,
        ).dict()
        for s in stations
    ]
    return ApiResponse(status="success", data=res)

@router.get("/stations/{station_id}/readings", response_model=ApiResponse)
def get_station_readings(
    station_id: str,
    hours: int = Query(24, ge=1, le=168, description="Number of past hours of observation readings"),
    db: Session = Depends(get_db),
):
    """Get high-frequency observation readings from a specific weather station."""
    s_repo = StationRepository(db)
    station = s_repo.get_by_id(station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "STATION_NOT_FOUND", "message": f"No station found with ID '{station_id}'"},
        )

    readings = aws_fetcher.fetch_station_readings(station_id=station_id, hours=hours)
    return ApiResponse(status="success", data={"station_id": station_id, "readings": readings})

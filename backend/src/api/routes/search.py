"""Search and Geo-lookup API routes."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from backend.src.db.connection import get_db
from backend.src.db.repositories import PanchayatRepository
from backend.src.api.schemas.forecast import PanchayatMetadata
from backend.src.api.schemas.common import ApiResponse

router = APIRouter(tags=["Search & Lookup"])

@router.get("/search/panchayat", response_model=ApiResponse)
def search_panchayats(
    q: Optional[str] = Query(None, description="Search by name in English or regional scripts"),
    state: Optional[str] = Query(None, description="Filter by state"),
    district: Optional[str] = Query(None, description="Filter by district"),
    lat: Optional[float] = Query(None, description="Center latitude for proximity search"),
    lon: Optional[float] = Query(None, description="Center longitude for proximity search"),
    radius_km: float = Query(50.0, description="Search radius in kilometers"),
    db: Session = Depends(get_db),
):
    """Search for Panchayats by text keywords, state/district filters, or GPS proximity."""
    p_repo = PanchayatRepository(db)
    results = p_repo.search(
        query=q,
        state=state,
        district=district,
        lat=lat,
        lon=lon,
        radius_km=radius_km,
    )

    items = [
        PanchayatMetadata(
            id=p.id,
            name=p.name,
            name_hi=p.name_hi,
            name_mr=p.name_mr,
            name_ta=p.name_ta,
            block=p.block_name,
            district=p.district,
            state=p.state,
            elevation_m=p.elevation_mean,
            latitude=p.latitude,
            longitude=p.longitude,
        ).dict()
        for p in results
    ]

    return ApiResponse(status="success", data={"total": len(items), "results": items})

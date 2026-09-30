"""Repository for Panchayat data operations."""
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.src.db.models import PanchayatModel
from backend.src.utils.geo_utils import haversine_distance

class PanchayatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, panchayat_id: str) -> Optional[PanchayatModel]:
        return self.db.query(PanchayatModel).filter(PanchayatModel.id == panchayat_id).first()

    def get_all(self, limit: int = 100) -> List[PanchayatModel]:
        return self.db.query(PanchayatModel).limit(limit).all()

    def get_by_block(self, block_id: str) -> List[PanchayatModel]:
        return self.db.query(PanchayatModel).filter(PanchayatModel.block_id == block_id).all()

    def search(
        self,
        query: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
        radius_km: float = 50.0,
    ) -> List[PanchayatModel]:
        q = self.db.query(PanchayatModel)
        if query:
            q = q.filter(
                (PanchayatModel.name.ilike(f"%{query}%"))
                | (PanchayatModel.name_hi.ilike(f"%{query}%"))
                | (PanchayatModel.name_mr.ilike(f"%{query}%"))
                | (PanchayatModel.name_ta.ilike(f"%{query}%"))
                | (PanchayatModel.block_name.ilike(f"%{query}%"))
                | (PanchayatModel.district.ilike(f"%{query}%"))
            )
        if state:
            q = q.filter(PanchayatModel.state.ilike(f"%{state}%"))
        if district:
            q = q.filter(PanchayatModel.district.ilike(f"%{district}%"))

        results = q.all()

        if lat is not None and lon is not None:
            # Distance filter
            filtered = []
            for p in results:
                dist = haversine_distance(lat, lon, p.latitude, p.longitude)
                if dist <= radius_km:
                    filtered.append(p)
            return sorted(
                filtered,
                key=lambda p: haversine_distance(lat, lon, p.latitude, p.longitude),
            )

        return results

    def create_or_update(self, panchayat_data: dict) -> PanchayatModel:
        existing = self.get_by_id(panchayat_data["id"])
        if existing:
            for k, v in panchayat_data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            p = PanchayatModel(**panchayat_data)
            self.db.add(p)
            self.db.commit()
            self.db.refresh(p)
            return p

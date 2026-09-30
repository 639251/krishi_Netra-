"""Repository for Agricultural Advisories."""
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from backend.src.db.models import AdvisoryModel

class AdvisoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_panchayat_and_date(
        self, panchayat_id: str, forecast_date: Optional[date] = None, crop: Optional[str] = None
    ) -> List[AdvisoryModel]:
        q = self.db.query(AdvisoryModel).filter(AdvisoryModel.panchayat_id == panchayat_id)
        if forecast_date:
            q = q.filter(AdvisoryModel.forecast_date == forecast_date)
        if crop:
            q = q.filter(AdvisoryModel.crop.ilike(f"%{crop}%"))
        return q.all()

    def save_advisory(self, data: dict) -> AdvisoryModel:
        existing = self.db.query(AdvisoryModel).filter(AdvisoryModel.id == data["id"]).first()
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            adv = AdvisoryModel(**data)
            self.db.add(adv)
            self.db.commit()
            self.db.refresh(adv)
            return adv

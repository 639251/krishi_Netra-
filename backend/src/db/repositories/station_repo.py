"""Repository for Weather Station data and readings."""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
from backend.src.db.models import StationModel, StationReadingModel

class StationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[StationModel]:
        return self.db.query(StationModel).all()

    def get_by_id(self, station_id: str) -> Optional[StationModel]:
        return self.db.query(StationModel).filter(StationModel.id == station_id).first()

    def get_readings(
        self,
        station_id: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[StationReadingModel]:
        q = self.db.query(StationReadingModel).filter(StationReadingModel.station_id == station_id)
        if start_time:
            q = q.filter(StationReadingModel.reading_time >= start_time)
        if end_time:
            q = q.filter(StationReadingModel.reading_time <= end_time)
        return q.order_by(StationReadingModel.reading_time.desc()).limit(limit).all()

    def save_station(self, data: dict) -> StationModel:
        existing = self.get_by_id(data["id"])
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            s = StationModel(**data)
            self.db.add(s)
            self.db.commit()
            self.db.refresh(s)
            return s

    def add_reading(self, data: dict) -> StationReadingModel:
        r = StationReadingModel(**data)
        self.db.add(r)
        self.db.commit()
        self.db.refresh(r)
        return r

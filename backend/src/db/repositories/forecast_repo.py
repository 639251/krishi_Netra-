"""Repository for Weather Forecast data operations."""
from sqlalchemy.orm import Session
from datetime import date
from typing import List, Optional
from backend.src.db.models import BlockForecastModel, PanchayatForecastModel

class ForecastRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_panchayat_forecasts(
        self, panchayat_id: str, start_date: date, days: int = 5
    ) -> List[PanchayatForecastModel]:
        return (
            self.db.query(PanchayatForecastModel)
            .filter(
                PanchayatForecastModel.panchayat_id == panchayat_id,
                PanchayatForecastModel.forecast_date >= start_date,
            )
            .order_by(PanchayatForecastModel.forecast_date.asc())
            .limit(days)
            .all()
        )

    def get_block_forecast(self, block_id: str, forecast_date: date) -> Optional[BlockForecastModel]:
        return (
            self.db.query(BlockForecastModel)
            .filter(
                BlockForecastModel.block_id == block_id,
                BlockForecastModel.forecast_date == forecast_date,
            )
            .first()
        )

    def save_panchayat_forecast(self, data: dict) -> PanchayatForecastModel:
        existing = (
            self.db.query(PanchayatForecastModel)
            .filter(
                PanchayatForecastModel.panchayat_id == data["panchayat_id"],
                PanchayatForecastModel.forecast_date == data["forecast_date"],
            )
            .first()
        )
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            fc = PanchayatForecastModel(**data)
            self.db.add(fc)
            self.db.commit()
            self.db.refresh(fc)
            return fc

    def save_block_forecast(self, data: dict) -> BlockForecastModel:
        existing = (
            self.db.query(BlockForecastModel)
            .filter(
                BlockForecastModel.block_id == data["block_id"],
                BlockForecastModel.forecast_date == data["forecast_date"],
            )
            .first()
        )
        if existing:
            for k, v in data.items():
                setattr(existing, k, v)
            self.db.commit()
            self.db.refresh(existing)
            return existing
        else:
            bfc = BlockForecastModel(**data)
            self.db.add(bfc)
            self.db.commit()
            self.db.refresh(bfc)
            return bfc

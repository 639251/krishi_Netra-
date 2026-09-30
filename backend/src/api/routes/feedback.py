"""Ground Truth Feedback and Continuous Model Calibration."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from backend.src.db.connection import get_db
from backend.src.db.models import FeedbackModel
from backend.src.api.schemas.feedback import FeedbackRequest
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.logger import logger

router = APIRouter(tags=["Ground Truth Feedback"])

@router.post("/feedback", response_model=ApiResponse)
def submit_forecast_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    """Submit ground-truth field observations to validate and continuously calibrate ML downscaling."""
    fb = FeedbackModel(
        panchayat_id=req.panchayat_id,
        date=req.date,
        parameter=req.parameter,
        forecast_value=req.forecast_value,
        actual_value=req.actual_value,
        reporter=req.reporter,
        notes=req.notes,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    delta = round(req.actual_value - req.forecast_value, 2)
    logger.info(
        f"Ground Truth Feedback received for {req.panchayat_id} [{req.parameter}]: Forecast={req.forecast_value}, Actual={req.actual_value} (Error={delta})"
    )

    return ApiResponse(
        status="success",
        data={
            "feedback_id": fb.id,
            "panchayat_id": fb.panchayat_id,
            "parameter": fb.parameter,
            "error_residual": delta,
            "recorded_at": fb.created_at.isoformat(),
        },
        message="Observation recorded successfully for model calibration.",
    )

@router.get("/feedback", response_model=ApiResponse)
def list_feedback(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieve recorded field observations and validation feedback logs."""
    items = db.query(FeedbackModel).order_by(FeedbackModel.created_at.desc()).limit(limit).all()
    res = [
        {
            "id": it.id,
            "panchayat_id": it.panchayat_id,
            "date": str(it.date),
            "parameter": it.parameter,
            "forecast_value": it.forecast_value,
            "actual_value": it.actual_value,
            "reporter": it.reporter,
            "notes": it.notes,
            "created_at": it.created_at.isoformat(),
        }
        for it in items
    ]
    return ApiResponse(status="success", data={"total": len(res), "records": res})

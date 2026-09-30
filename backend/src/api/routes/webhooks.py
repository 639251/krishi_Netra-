"""Webhook Registration and Real-time event notifications."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import secrets

from backend.src.db.connection import get_db
from backend.src.db.models import WebhookModel
from backend.src.api.schemas.feedback import WebhookRegisterRequest
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.logger import logger

router = APIRouter(tags=["Webhooks"])

@router.post("/webhooks/register", response_model=ApiResponse)
def register_webhook(req: WebhookRegisterRequest, db: Session = Depends(get_db)):
    """Register client webhook URL to receive push updates when new forecasts or alerts are generated."""
    secret = req.secret or secrets.token_hex(20)
    hook = WebhookModel(
        url=req.url,
        events=req.events,
        panchayat_ids=req.panchayat_ids,
        secret=secret,
    )
    db.add(hook)
    db.commit()
    db.refresh(hook)

    return ApiResponse(
        status="success",
        data={
            "webhook_id": hook.id,
            "url": hook.url,
            "events": hook.events,
            "secret": secret,
            "status": "active",
        },
        message="Webhook registered successfully.",
    )

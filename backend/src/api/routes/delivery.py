"""Live Delivery API routes for SMS and WhatsApp."""
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import os
import re

from backend.src.api.dependencies import sms_service, whatsapp_service
from backend.src.api.schemas.common import ApiResponse
from backend.src.utils.logger import logger

router = APIRouter(tags=["Message Delivery"])

class SMSRequest(BaseModel):
    phone_number: str
    message: str
    template_id: Optional[str] = None

class WhatsAppRequest(BaseModel):
    phone_number: str
    header: str
    body: str

@router.post("/delivery/sms", response_model=ApiResponse)
async def send_sms_endpoint(req: SMSRequest):
    """
    Sends live SMS via MSG91 API if key is present,
    or returns high-fidelity simulation with explicit delivery details.
    """
    cleaned_phone = re.sub(r'[^0-9]', '', req.phone_number)
    # Ensure 10-12 digit Indian format (e.g., 919823045892)
    if len(cleaned_phone) == 10:
        cleaned_phone = f"91{cleaned_phone}"

    logger.info(f"Triggering SMS delivery to {cleaned_phone}")
    result = await sms_service.send_sms(
        phone_number=cleaned_phone,
        message=req.message,
        template_id=req.template_id,
    )

    return ApiResponse(
        status="success",
        data=result,
        message=f"SMS dispatched to {cleaned_phone}",
    )

@router.post("/delivery/whatsapp", response_model=ApiResponse)
async def send_whatsapp_endpoint(req: WhatsAppRequest):
    """Sends WhatsApp message via Meta Cloud API or simulator."""
    cleaned_phone = re.sub(r'[^0-9]', '', req.phone_number)
    if len(cleaned_phone) == 10:
        cleaned_phone = f"91{cleaned_phone}"

    result = await whatsapp_service.send_advisory(
        phone_number=cleaned_phone,
        header=req.header,
        body=req.body,
    )
    return ApiResponse(
        status="success",
        data=result,
        message=f"WhatsApp message dispatched to {cleaned_phone}",
    )

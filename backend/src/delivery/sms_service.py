"""MSG91 SMPP / REST SMS Gateway Service."""
import httpx
import os
from typing import Dict, Any, Optional
from backend.src.utils.logger import logger

class SMSService:
    """Delivers hyper-local regional language weather alerts to feature phones via SMS."""

    def __init__(self, auth_key: Optional[str] = None):
        self.auth_key = auth_key or os.environ.get("MSG91_AUTH_KEY", "")
        self.sender_id = os.environ.get("MSG91_SENDER_ID", "KNETRA")
        self.api_url = "https://control.msg91.com/api/v5/flow/"

    async def send_sms(
        self,
        phone_number: str,
        message: str,
        template_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Sends SMS via MSG91 flow API, or returns high-fidelity simulation if no API key is provided."""
        logger.info(f"Dispatching SMS to {phone_number} (Length: {len(message)} chars)")

        if not self.auth_key:
            return {
                "status": "success",
                "mode": "simulation",
                "gateway": "MSG91_SMPP_SIMULATOR",
                "phone": phone_number,
                "message": message,
                "message_id": f"msg91_sim_{hash(phone_number + message) % 1000000}",
                "delivered_at": "immediate",
            }

        headers = {
            "authkey": self.auth_key,
            "content-type": "application/json",
        }
        payload = {
            "template_id": template_id or "6481a7b8e...",
            "short_url": "1",
            "recipients": [{"mobiles": phone_number, "message": message}],
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(self.api_url, json=payload, headers=headers)
                return res.json()
        except Exception as e:
            logger.error(f"Failed to send SMS via MSG91: {e}")
            return {"status": "error", "error": str(e)}

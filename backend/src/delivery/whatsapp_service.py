"""Meta WhatsApp Business Cloud API Gateway Service."""
import httpx
import os
from typing import Dict, Any, Optional
from backend.src.utils.logger import logger

class WhatsAppService:
    """Delivers rich multimedia weather advisories & cards via WhatsApp Business API."""

    def __init__(self, token: Optional[str] = None, phone_number_id: Optional[str] = None):
        self.token = token or os.environ.get("WHATSAPP_API_TOKEN", "")
        self.phone_number_id = phone_number_id or os.environ.get("WHATSAPP_PHONE_ID", "108742918237")
        self.api_url = f"https://graph.facebook.com/v19.0/{self.phone_number_id}/messages"

    async def send_advisory(
        self,
        phone_number: str,
        header: str,
        body: str,
        footer: str = "🌾 KrishiNetra • Kisan AI Helpline 1800-180-1551",
    ) -> Dict[str, Any]:
        logger.info(f"Dispatching WhatsApp advisory message to {phone_number}")

        if not self.token:
            return {
                "status": "success",
                "mode": "simulation",
                "gateway": "META_WHATSAPP_CLOUD_SIMULATOR",
                "recipient": phone_number,
                "preview": {
                    "header": header,
                    "body": body,
                    "footer": footer,
                },
                "whatsapp_msg_id": f"wamid_sim_{hash(phone_number + header) % 1000000}",
            }

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "text",
            "text": {
                "body": f"*{header}*\n\n{body}\n\n_{footer}_"
            },
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(self.api_url, json=payload, headers=headers)
                return res.json()
        except Exception as e:
            logger.error(f"Failed to send WhatsApp message: {e}")
            return {"status": "error", "error": str(e)}

"""Notification Queue and Dispatch Worker."""
import asyncio
from typing import Dict, Any, List
from .sms_service import SMSService
from .whatsapp_service import WhatsAppService
from .push_notification import PushNotificationService
from backend.src.utils.logger import logger

class NotificationQueue:
    """Asynchronous queue manager for bulk delivery of panchayat forecasts and advisories."""

    def __init__(self):
        self.sms_service = SMSService()
        self.wa_service = WhatsAppService()
        self.push_service = PushNotificationService()
        self.queue: asyncio.Queue = asyncio.Queue()

    async def enqueue(self, item: Dict[str, Any]):
        await self.queue.put(item)

    async def dispatch_all(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        results = []
        for it in items:
            channel = it.get("channel", "sms")
            recipient = it.get("recipient", "9876543210")
            msg = it.get("message", "")
            if channel == "sms":
                res = await self.sms_service.send_sms(recipient, msg)
            elif channel == "whatsapp":
                header = it.get("header", "KrishiNetra Advisory")
                res = await self.wa_service.send_advisory(recipient, header, msg)
            elif channel == "push":
                title = it.get("title", "Weather Alert")
                res = await self.push_service.send_push_alert(recipient, title, msg)
            else:
                res = {"status": "unsupported_channel"}
            results.append(res)
        return results

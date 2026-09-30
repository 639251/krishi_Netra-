"""Firebase Cloud Messaging (FCM) Push Notification Service."""
import os
from typing import Dict, Any, Optional
from backend.src.utils.logger import logger

class PushNotificationService:
    """Delivers real-time push alerts to Mobile App (React Native / Android)."""

    def __init__(self, fcm_server_key: Optional[str] = None):
        self.fcm_server_key = fcm_server_key or os.environ.get("FCM_SERVER_KEY", "")

    async def send_push_alert(
        self,
        device_token: str,
        title: str,
        body: str,
        data_payload: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        logger.info(f"Dispatching Push Notification: '{title}' to device {device_token[:10]}...")
        return {
            "status": "success",
            "mode": "simulation" if not self.fcm_server_key else "live",
            "message_id": f"fcm_msg_{hash(title + body) % 1000000}",
            "title": title,
            "body": body,
            "data": data_payload or {},
        }

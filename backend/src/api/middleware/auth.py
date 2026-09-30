"""Authentication middleware and JWT token verification."""
import time
import hmac
import hashlib
import json
import base64
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "krishinetra-secret-key-for-jwt-tokens-development-only"
security = HTTPBearer(auto_error=False)

def create_jwt_token(payload: Dict[str, Any], expires_in: int = 3600) -> str:
    """Creates standard base64/hmac-sha256 signed token."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = dict(payload)
    payload_copy["exp"] = int(time.time()) + expires_in

    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload_copy).encode()).decode().rstrip("=")

    signature = hmac.new(
        SECRET_KEY.encode(),
        f"{header_b64}.{payload_b64}".encode(),
        hashlib.sha256
    ).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")

    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_jwt_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts

        expected_sig = hmac.new(
            SECRET_KEY.encode(),
            f"{header_b64}.{payload_b64}".encode(),
            hashlib.sha256
        ).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")

        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None

        # Pad payload if needed
        padding = 4 - (len(payload_b64) % 4)
        if padding != 4:
            payload_b64 += "=" * padding

        payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

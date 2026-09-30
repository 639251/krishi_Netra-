"""Authentication schemas."""
from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    name: str
    email: str
    organization: Optional[str] = None
    purpose: Optional[str] = None

class RegisterResponse(BaseModel):
    api_key: str
    secret: str
    name: str
    organization: Optional[str] = None

class TokenRequest(BaseModel):
    api_key: str
    secret: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 3600

"""Authentication API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import secrets
import hashlib
from backend.src.db.connection import get_db
from backend.src.db.models import ApiKeyModel
from backend.src.api.schemas.auth import RegisterRequest, RegisterResponse, TokenRequest, TokenResponse
from backend.src.api.schemas.common import ApiResponse
from backend.src.api.middleware.auth import create_jwt_token

router = APIRouter(tags=["Authentication"])

@router.post("/auth/register", response_model=ApiResponse)
def register_client(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register for API key and access credentials."""
    existing = db.query(ApiKeyModel).filter(ApiKeyModel.email == req.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "EMAIL_EXISTS", "message": f"Organization with email {req.email} already registered"},
        )

    api_key = f"ak_live_{secrets.token_hex(16)}"
    secret = f"sk_live_{secrets.token_hex(24)}"
    secret_hash = hashlib.sha256(secret.encode()).hexdigest()

    new_key = ApiKeyModel(
        name=req.name,
        email=req.email,
        organization=req.organization,
        api_key=api_key,
        secret_hash=secret_hash,
    )
    db.add(new_key)
    db.commit()

    return ApiResponse(
        status="success",
        data=RegisterResponse(
            api_key=api_key,
            secret=secret,
            name=req.name,
            organization=req.organization,
        ).dict(),
        message="API Key created successfully. Store secret securely.",
    )

@router.post("/auth/token", response_model=TokenResponse)
def get_access_token(req: TokenRequest, db: Session = Depends(get_db)):
    """Exchange API key and Secret for short-lived JWT Bearer token."""
    key_entry = db.query(ApiKeyModel).filter(ApiKeyModel.api_key == req.api_key).first()
    secret_hash = hashlib.sha256(req.secret.encode()).hexdigest()

    if not key_entry or key_entry.secret_hash != secret_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_CREDENTIALS", "message": "Invalid API key or secret"},
        )

    token = create_jwt_token(
        payload={"sub": key_entry.email, "name": key_entry.name, "key_id": key_entry.id},
        expires_in=3600,
    )
    return TokenResponse(access_token=token, token_type="bearer", expires_in=3600)

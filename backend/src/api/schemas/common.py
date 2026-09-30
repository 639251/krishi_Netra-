"""Common Pydantic schemas."""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class ApiResponse(BaseModel):
    status: str = "success"
    data: Optional[Any] = None
    message: Optional[str] = None

class ErrorDetail(BaseModel):
    code: str
    message: str
    field: Optional[str] = None

class ApiErrorResponse(BaseModel):
    status: str = "error"
    error: ErrorDetail

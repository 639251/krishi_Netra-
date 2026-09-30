"""Schemas exports."""
from .common import ApiResponse, ApiErrorResponse, ErrorDetail
from .auth import RegisterRequest, RegisterResponse, TokenRequest, TokenResponse
from .forecast import (
    PanchayatMetadata,
    ForecastParameter,
    UncertaintyRange,
    SingleForecastDay,
    PanchayatForecastResponse,
    PanchayatComparisonItem,
    BlockComparisonResponse,
)
from .advisory import SingleAdvisoryItem, PanchayatAdvisoryResponse
from .station import StationSchema, StationReadingSchema
from .feedback import FeedbackRequest, WebhookRegisterRequest

__all__ = [
    "ApiResponse",
    "ApiErrorResponse",
    "ErrorDetail",
    "RegisterRequest",
    "RegisterResponse",
    "TokenRequest",
    "TokenResponse",
    "PanchayatMetadata",
    "ForecastParameter",
    "UncertaintyRange",
    "SingleForecastDay",
    "PanchayatForecastResponse",
    "PanchayatComparisonItem",
    "BlockComparisonResponse",
    "SingleAdvisoryItem",
    "PanchayatAdvisoryResponse",
    "StationSchema",
    "StationReadingSchema",
    "FeedbackRequest",
    "WebhookRegisterRequest",
]

"""
Enrollment models for e-learning platform
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .user import PyObjectId


class Enrollment(BaseModel):
    """Enrollment model matching database schema"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    courseId: PyObjectId
    enrolledAt: datetime
    createdAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
        "populate_by_name": True
    }


class EnrollmentResponse(BaseModel):
    """Enrollment response model"""
    id: str
    userId: str
    courseId: str
    enrolledAt: datetime
    createdAt: datetime


class EnrollmentCreateResponse(BaseModel):
    """Enrollment creation response model"""
    success: bool = True
    message: str
    enrollment: dict
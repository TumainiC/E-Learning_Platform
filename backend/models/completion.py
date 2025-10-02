"""
Completion models for tracking student progress
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .user import PyObjectId


class Completion(BaseModel):
    """Course completion model"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    courseId: PyObjectId
    completedAt: datetime
    progress: float = Field(default=0.0, ge=0.0, le=100.0)  # Percentage completed

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str}
    }


class CompletionResponse(BaseModel):
    """Completion response model"""
    id: str
    userId: str
    courseId: str
    completedAt: datetime
    progress: float
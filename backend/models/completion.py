"""
Completion models for tracking student progress
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .user import PyObjectId


class Completion(BaseModel):
    """Course completion model matching database schema"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    courseId: PyObjectId
    completedAt: datetime
    createdAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
        "populate_by_name": True
    }


class CompletionResponse(BaseModel):
    """Completion response model"""
    id: str
    userId: str
    courseId: str
    completedAt: datetime
    createdAt: datetime
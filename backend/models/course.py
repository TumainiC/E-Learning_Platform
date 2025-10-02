"""
Course models for e-learning platform
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from .user import PyObjectId


class Course(BaseModel):
    """Course model"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    instructor: str
    duration: int  # Duration in minutes
    difficulty: str  # beginner, intermediate, advanced
    thumbnail: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str}
    }


class CourseResponse(BaseModel):
    """Course response model"""
    id: str
    title: str
    description: str
    instructor: str
    duration: int
    difficulty: str
    thumbnail: Optional[str] = None
"""
Course models for e-learning platform
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum
from .user import PyObjectId


class LevelEnum(str, Enum):
    """Course difficulty levels"""
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class Course(BaseModel):
    """Course model matching database schema"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    instructor: str
    duration: str  # Duration as string (e.g., "6 weeks")
    lessonsCount: int = Field(..., alias="lessonsCount")
    level: LevelEnum
    syllabus: List[str]
    objectives: List[str]
    thumbnail: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
        "populate_by_name": True
    }


class CourseResponse(BaseModel):
    """Course response model"""
    id: str
    title: str
    description: str
    instructor: str
    duration: str
    lessonsCount: int
    level: str
    syllabus: List[str]
    objectives: List[str]
    thumbnail: Optional[str] = None
    isCompleted: bool = False
    completedAt: Optional[datetime] = None


class CoursesListResponse(BaseModel):
    """Courses list API response model"""
    success: bool = True
    courses: List[CourseResponse]


class CourseDetailResponse(BaseModel):
    """Individual course detail API response model"""
    success: bool = True
    course: CourseResponse
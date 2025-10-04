"""
Completion models for tracking student progress
"""
from pydantic import BaseModel, Field
from typing import Optional, List
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


class ModuleCompletion(BaseModel):
    """Module completion model matching database schema"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    userId: PyObjectId
    courseId: PyObjectId
    moduleIndex: int  # Index in the course syllabus
    moduleTitle: str
    completedAt: datetime
    createdAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
        "populate_by_name": True
    }


class ModuleCompletionResponse(BaseModel):
    """Module completion response model"""
    id: str
    userId: str
    courseId: str
    moduleIndex: int
    moduleTitle: str
    completedAt: datetime


class ModuleCompletionCreateRequest(BaseModel):
    """Request to complete a module"""
    moduleIndex: int
    moduleTitle: str


class ModuleCompletionCreateResponse(BaseModel):
    """Module completion creation response"""
    success: bool = True
    message: str
    completion: ModuleCompletionResponse
    pointsAwarded: int = 10
    totalPoints: int = 0
    courseCompleted: bool = False


class CourseProgressResponse(BaseModel):
    """Course progress response with module completions"""
    success: bool = True
    courseId: str
    totalModules: int
    completedModules: int
    progressPercentage: float
    completions: List[ModuleCompletionResponse]
    isFullyCompleted: bool
    pointsEarned: int = 0
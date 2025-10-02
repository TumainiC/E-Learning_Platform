"""
Courses routes for e-learning platform
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from ..models.course import Course, CourseResponse
from ..middleware.auth import AuthMiddleware
import logging

logger = logging.getLogger(__name__)

# Create router for course endpoints
router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/", response_model=List[CourseResponse])
async def get_courses():
    """
    Get all available courses
    
    Returns:
        List of courses
    """
    # TODO: Implement course retrieval from database
    return []


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: str):
    """
    Get a specific course by ID
    
    Args:
        course_id: Course ID
        
    Returns:
        Course details
    """
    # TODO: Implement course retrieval by ID
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Course not found"
    )
"""
Courses routes for e-learning platform
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime
from ..models.course import Course, CourseResponse, CoursesListResponse, CourseDetailResponse
from ..middleware.auth import get_current_user_dependency
from ..utils.db import get_courses_collection, get_completions_collection
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Create router for course endpoints
router = APIRouter(prefix="/api/courses", tags=["courses"])


async def seed_courses():
    """
    Seed the database with initial course data
    """
    courses_collection = get_courses_collection()
    
    # Check if courses already exist
    existing_count = await courses_collection.count_documents({})
    if existing_count > 0:
        logger.info(f"Database already contains {existing_count} courses. Skipping seeding.")
        return
    
    # Define the 3 courses to seed
    seed_data = [
        {
            "title": "Introduction to Python Programming",
            "description": "Master the fundamentals of Python programming from scratch. This comprehensive course covers everything you need to start your programming journey, from basic syntax to advanced concepts like object-oriented programming. Perfect for absolute beginners with no prior coding experience.",
            "instructor": "Dr. Sarah Johnson",
            "duration": "6 weeks",
            "lessonsCount": 24,
            "level": "Beginner",
            "syllabus": [
                "Python Basics and Setup",
                "Variables and Data Types", 
                "Control Flow and Loops",
                "Functions and Modules",
                "Object-Oriented Programming",
                "File Handling and Exceptions"
            ],
            "objectives": [
                "Write clean and efficient Python code",
                "Understand fundamental programming concepts",
                "Build simple Python applications",
                "Debug and troubleshoot code effectively"
            ],
            "thumbnail": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "title": "Modern Web Development with React",
            "description": "Dive deep into React and learn how to build modern, scalable web applications. This course covers React fundamentals, hooks, state management, routing, and best practices for building production-ready applications. You'll work on real-world projects and learn industry-standard tools and workflows.",
            "instructor": "Michael Chen",
            "duration": "8 weeks",
            "lessonsCount": 32,
            "level": "Intermediate",
            "syllabus": [
                "React Fundamentals and JSX",
                "Components and Props",
                "State and Lifecycle",
                "Hooks in Depth",
                "Context API and State Management",
                "React Router and Navigation",
                "API Integration",
                "Performance Optimization"
            ],
            "objectives": [
                "Build interactive user interfaces with React",
                "Manage complex application state",
                "Implement routing in single-page applications",
                "Optimize React applications for performance",
                "Work with RESTful APIs"
            ],
            "thumbnail": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        },
        {
            "title": "Advanced Data Structures and Algorithms",
            "description": "Take your programming skills to the next level with this advanced course on data structures and algorithms. Learn how to analyze algorithm complexity, implement efficient data structures, and solve complex computational problems. Essential for technical interviews and building high-performance applications.",
            "instructor": "Prof. Emily Rodriguez",
            "duration": "10 weeks",
            "lessonsCount": 40,
            "level": "Advanced",
            "syllabus": [
                "Algorithm Complexity Analysis",
                "Advanced Array and String Manipulation",
                "Trees and Graph Algorithms",
                "Dynamic Programming",
                "Advanced Sorting and Searching",
                "Hash Tables and Sets",
                "Heaps and Priority Queues",
                "Advanced Problem-Solving Techniques"
            ],
            "objectives": [
                "Analyze time and space complexity of algorithms",
                "Implement complex data structures from scratch",
                "Solve algorithmic problems efficiently",
                "Prepare for technical coding interviews",
                "Optimize code for performance"
            ],
            "thumbnail": None,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
    ]
    
    try:
        result = await courses_collection.insert_many(seed_data)
        logger.info(f"Successfully seeded {len(result.inserted_ids)} courses")
    except Exception as e:
        logger.error(f"Failed to seed courses: {e}")


@router.get("/", response_model=CoursesListResponse)
async def get_courses(current_user: dict = Depends(get_current_user_dependency)):
    """
    Get all available courses (protected route)
    
    Args:
        current_user: Current authenticated user
    
    Returns:
        List of all courses with completion status
    """
    try:
        # Ensure courses are seeded
        await seed_courses()
        
        # Get courses and completions collections
        courses_collection = get_courses_collection()
        completions_collection = get_completions_collection()
        
        # Fetch all courses from database
        courses_cursor = courses_collection.find({})
        courses = await courses_cursor.to_list(length=None)
        
        # Get user's completed courses with completion dates
        user_id = ObjectId(current_user["_id"])
        completed_courses_cursor = completions_collection.find({"userId": user_id})
        completed_courses = await completed_courses_cursor.to_list(length=None)
        completed_course_map = {
            str(completion["courseId"]): completion["completedAt"] 
            for completion in completed_courses
        }
        
        # Convert to response format with completion status
        course_responses = []
        for course in courses:
            course_id = str(course["_id"])
            completed_at = completed_course_map.get(course_id)
            is_completed = completed_at is not None
            
            course_response = CourseResponse(
                id=course_id,
                title=course["title"],
                description=course["description"],
                instructor=course["instructor"],
                duration=course["duration"],
                lessonsCount=course["lessonsCount"],
                level=course["level"],
                syllabus=course["syllabus"],
                objectives=course["objectives"],
                thumbnail=course["thumbnail"],
                isCompleted=is_completed,
                completedAt=completed_at
            )
            course_responses.append(course_response)
        
        logger.info(f"Retrieved {len(course_responses)} courses for user {current_user['email']}")
        
        return CoursesListResponse(
            success=True,
            courses=course_responses
        )
        
    except Exception as e:
        logger.error(f"Failed to retrieve courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve courses"
        )


@router.get("/{course_id}", response_model=CourseDetailResponse)
async def get_course(course_id: str, current_user: dict = Depends(get_current_user_dependency)):
    """
    Get a specific course by ID (protected route)
    
    Args:
        course_id: Course ID
        current_user: Current authenticated user
        
    Returns:
        Course details with completion status and date
    """
    try:
        from bson.errors import InvalidId
        
        # Validate ObjectId
        try:
            object_id = ObjectId(course_id)
        except InvalidId:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid course ID format"
            )
        
        # Get courses and completions collections
        courses_collection = get_courses_collection()
        completions_collection = get_completions_collection()
        
        # Find course by ID
        course = await courses_collection.find_one({"_id": object_id})
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Check if user completed this course and get completion date
        user_id = ObjectId(current_user["_id"])
        completion = await completions_collection.find_one({
            "userId": user_id,
            "courseId": object_id
        })
        
        is_completed = completion is not None
        completed_at = completion["completedAt"] if completion else None
        
        # Convert to response format
        course_response = CourseResponse(
            id=str(course["_id"]),
            title=course["title"],
            description=course["description"],
            instructor=course["instructor"],
            duration=course["duration"],
            lessonsCount=course["lessonsCount"],
            level=course["level"],
            syllabus=course["syllabus"],
            objectives=course["objectives"],
            thumbnail=course["thumbnail"],
            isCompleted=is_completed,
            completedAt=completed_at
        )
        
        logger.info(f"Retrieved course {course_id} for user {current_user['email']}")
        
        return CourseDetailResponse(
            success=True,
            course=course_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to retrieve course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve course"
        )
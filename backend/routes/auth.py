"""
Authentication routes for user signup and login
"""
from fastapi import APIRouter, HTTPException, status, Depends
from ..models.user import (
    UserSignupRequest, 
    UserLoginRequest, 
    AuthResponse, 
    UserResponse,
    UserInDB
)
from ..utils.auth import (
    hash_password, 
    verify_password, 
    validate_email, 
    validate_password_strength,
    create_access_token
)
from ..utils.db import get_users_collection
from ..middleware.auth import get_current_user_dependency
from datetime import datetime
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# Create router for authentication endpoints
router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/signup", response_model=AuthResponse)
async def signup(user_data: UserSignupRequest):
    """
    Register a new user
    
    Args:
        user_data: User signup data
        
    Returns:
        Authentication response with token and user info
        
    Raises:
        HTTPException: If validation fails or email already exists
    """
    # Password validation is handled by Pydantic field validator
    
    # Validate email format
    if not validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Validate password strength
    is_valid, error_message = validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message
        )
    
    # Check if email already exists (case-insensitive)
    users_collection = get_users_collection()
    existing_user = await users_collection.find_one(
        {"email": {"$regex": f"^{user_data.email}$", "$options": "i"}}
    )
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(user_data.password)
    
    # Create user document
    now = datetime.utcnow()
    user_doc = {
        "email": user_data.email.lower(),
        "password_hash": password_hash,
        "fullName": user_data.fullName,
        "points": 0,
        "createdAt": now,
        "updatedAt": now
    }
    
    # Insert user into database
    result = await users_collection.insert_one(user_doc)
    user_id = result.inserted_id
    
    # Generate JWT token
    token_data = {"user_id": str(user_id), "email": user_data.email.lower()}
    access_token = create_access_token(token_data)
    
    # Create response
    user_response = UserResponse(
        id=str(user_id),
        email=user_data.email.lower(),
        fullName=user_data.fullName,
        points=0
    )
    
    logger.info(f"New user registered: {user_data.email}")
    
    return AuthResponse(
        success=True,
        message="Account created successfully",
        token=access_token,
        user=user_response
    )


@router.post("/login", response_model=AuthResponse)
async def login(user_data: UserLoginRequest):
    """
    Authenticate user and return token
    
    Args:
        user_data: User login data
        
    Returns:
        Authentication response with token and user info
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email (case-insensitive)
    users_collection = get_users_collection()
    user = await users_collection.find_one(
        {"email": {"$regex": f"^{user_data.email}$", "$options": "i"}}
    )
    
    # Check if user exists and password is correct
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Update user's last login timestamp
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"updatedAt": datetime.utcnow()}}
    )
    
    # Generate JWT token
    token_data = {"user_id": str(user["_id"]), "email": user["email"]}
    access_token = create_access_token(token_data)
    
    # Create response
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        fullName=user["fullName"],
        points=user.get("points", 0)
    )
    
    logger.info(f"User logged in: {user['email']}")
    
    return AuthResponse(
        success=True,
        message="Login successful",
        token=access_token,
        user=user_response
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user_dependency)):
    """
    Get current user information
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User information
    """
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        fullName=current_user["fullName"],
        points=current_user.get("points", 0)
    )


@router.post("/test-points/{points}")
async def test_add_points(points: int, current_user: dict = Depends(get_current_user_dependency)):
    """
    Test endpoint to add points to current user (for testing)
    """
    from ..utils.db import get_users_collection
    from bson import ObjectId
    
    users_collection = get_users_collection()
    user_id = ObjectId(current_user["_id"])
    
    # Update user points
    await users_collection.update_one(
        {"_id": user_id},
        {"$inc": {"points": points}}
    )
    
    # Get updated user
    updated_user = await users_collection.find_one({"_id": user_id})
    
    return {
        "success": True,
        "message": f"Added {points} points",
        "total_points": updated_user.get("points", 0)
    }

"""
Authentication middleware for protecting routes
"""
from functools import wraps
from fastapi import HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..utils.auth import get_user_from_token
from ..utils.db import get_users_collection
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)

# HTTP Bearer token security scheme
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials):
    """
    Get current user from JWT token
    
    Args:
        credentials: HTTP authorization credentials
        
    Returns:
        User document from database
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    # Verify token and extract user info
    user_info = get_user_from_token(token)
    if user_info is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    users_collection = get_users_collection()
    user = await users_collection.find_one({"_id": ObjectId(user_info["user_id"])})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user


def require_auth(func):
    """
    Decorator to require authentication for route handlers
    
    Usage:
        @require_auth
        async def protected_route(request: Request):
            user = request.state.user
            return {"user_id": str(user["_id"])}
    """
    @wraps(func)
    async def wrapper(request: Request, *args, **kwargs):
        # Extract token from Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing or invalid authorization header",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        token = auth_header.split(" ")[1]
        
        # Verify token and get user
        user_info = get_user_from_token(token)
        if user_info is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Get user from database
        users_collection = get_users_collection()
        user = await users_collection.find_one({"_id": ObjectId(user_info["user_id"])})
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Attach user to request state
        request.state.user = user
        
        # Call the original function
        return await func(request, *args, **kwargs)
    
    return wrapper


class AuthMiddleware:
    """
    Authentication middleware class for dependency injection
    """
    
    def __init__(self, credentials: HTTPAuthorizationCredentials = security):
        self.credentials = credentials
    
    async def __call__(self) -> dict:
        """
        Verify credentials and return user
        
        Returns:
            User document from database
        """
        return await get_current_user(self.credentials)
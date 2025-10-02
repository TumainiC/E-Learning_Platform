"""
Authentication utilities for password hashing and JWT token handling
"""
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..config import settings
import re

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password
    """
    # Ensure password is bytes and truncate to 72 bytes if necessary (bcrypt limit)
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    return pwd_context.hash(password_bytes)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    # Ensure password is bytes and truncate to 72 bytes if necessary (bcrypt limit)
    password_bytes = plain_password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
    
    return pwd_context.verify(password_bytes, hashed_password)


def validate_email(email: str) -> bool:
    """
    Validate email format using regex
    
    Args:
        email: Email address to validate
        
    Returns:
        True if valid email format, False otherwise
    """
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password strength requirements
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'\d', password):
        return False, "Password must contain at least one number"
    
    return True, ""


def create_access_token(data: dict) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Payload data to encode in token
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode, 
        settings.jwt_secret_key, 
        algorithm=settings.jwt_algorithm
    )
    return encoded_jwt


def verify_token(token: str) -> dict | None:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token to verify
        
    Returns:
        Decoded token payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token, 
            settings.jwt_secret_key, 
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError:
        return None


def get_user_from_token(token: str) -> dict | None:
    """
    Extract user information from JWT token
    
    Args:
        token: JWT token
        
    Returns:
        User info dict if token is valid, None otherwise
    """
    payload = verify_token(token)
    if payload is None:
        return None
    
    user_id = payload.get("user_id")
    email = payload.get("email")
    
    if user_id is None or email is None:
        return None
    
    return {"user_id": user_id, "email": email}
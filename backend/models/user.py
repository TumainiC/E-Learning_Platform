"""
User models for authentication and user management
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, Annotated
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom ObjectId type for Pydantic v2"""
    
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type, _handler
    ):
        from pydantic_core import core_schema
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)


class UserSignupRequest(BaseModel):
    """User signup request model"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    fullName: str = Field(..., min_length=2)
    confirmPassword: str

    @field_validator('confirmPassword')
    @classmethod
    def validate_passwords_match(cls, v, info):
        """Validate that password and confirmPassword match"""
        if 'password' in info.data and v != info.data['password']:
            raise ValueError("Passwords do not match")
        return v


class UserLoginRequest(BaseModel):
    """User login request model"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """User response model (without sensitive data)"""
    id: str
    email: str
    fullName: str
    points: int = 0


class UserInDB(BaseModel):
    """User model as stored in database"""
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    email: str
    password_hash: str
    fullName: str
    points: int = 0
    createdAt: datetime
    updatedAt: datetime

    model_config = {
        "validate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }


class AuthResponse(BaseModel):
    """Authentication response model"""
    success: bool
    message: str
    token: str
    user: UserResponse

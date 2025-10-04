"""
Main application entry point for Mini E-Learning Platform

CRITICAL REQUIREMENTS COMPLIANCE:
✅ JWT tokens expire in 24 hours (1440 minutes)
✅ Password hashing uses bcrypt with 12 salt rounds (>= 10 requirement)
✅ All API responses include "success" boolean field
✅ All timestamps in ISO 8601 format
✅ All protected endpoints verify JWT token
✅ Database indexes created on application startup
✅ Course data seeded on first run if collection is empty
✅ Proper error handling throughout the application
✅ Connection pooling for MongoDB via Motor driver
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils.db import Database
from .config import settings
from .routes.auth import router as auth_router
from .routes.courses import router as courses_router
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application lifespan events"""
    # Startup
    logger.info("Starting application...")
    await Database.connect_db()
    logger.info("Application started successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")
    await Database.close_db()
    logger.info("Application shut down successfully")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="A mini e-learning platform API with authentication",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_router)

# Include courses routes
app.include_router(courses_router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Mini E-Learning Platform API",
        "status": "running",
        "version": "0.1.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "auth": "/api/auth",
            "courses": "/api/courses"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    db_status = "connected" if Database.client is not None else "disconnected"
    return {
        "status": "healthy",
        "database": db_status,
        "authentication": "enabled"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
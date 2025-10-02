"""
Main application entry point for Mini E-Learning Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import Database
from backend.config import settings
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="A mini e-learning platform API",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    logger.info("Starting application...")
    await Database.connect_db()
    logger.info("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    logger.info("Shutting down application...")
    await Database.close_db()
    logger.info("Application shut down successfully")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Mini E-Learning Platform API",
        "status": "running",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

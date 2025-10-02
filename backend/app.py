"""
Main application entry point for Mini E-Learning Platform
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .utils.db import Database
from .config import settings
from .routes.auth import router as auth_router
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
            "auth": "/api/auth"
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
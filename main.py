"""
Entry point for the Mini E-Learning Platform
This file starts the FastAPI application from the backend package
"""
import uvicorn
from backend.app import app
from backend.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "backend.app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

"""
MongoDB database connection utility
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from backend.config import settings
import logging

logger = logging.getLogger(__name__)


class Database:
    """MongoDB database connection manager"""
    
    client: AsyncIOMotorClient = None
    
    @classmethod
    async def connect_db(cls):
        """
        Establish connection to MongoDB
        """
        try:
            cls.client = AsyncIOMotorClient(settings.mongodb_uri)
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
        except ConnectionFailure as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            raise
    
    @classmethod
    async def close_db(cls):
        """
        Close MongoDB connection
        """
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")
    
    @classmethod
    def get_database(cls):
        """
        Get database instance
        """
        if not cls.client:
            raise Exception("Database not connected. Call connect_db() first.")
        return cls.client[settings.database_name]
    
    @classmethod
    def get_collection(cls, collection_name: str):
        """
        Get a specific collection from the database
        
        Args:
            collection_name: Name of the collection to retrieve
            
        Returns:
            Motor collection instance
        """
        db = cls.get_database()
        return db[collection_name]


# Convenience functions for accessing collections
def get_users_collection():
    """Get users collection"""
    return Database.get_collection("users")


def get_courses_collection():
    """Get courses collection"""
    return Database.get_collection("courses")


def get_enrollments_collection():
    """Get enrollments collection"""
    return Database.get_collection("enrollments")


def get_lessons_collection():
    """Get lessons collection"""
    return Database.get_collection("lessons")

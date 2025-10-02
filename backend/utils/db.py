"""
MongoDB database connection utility
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from ..config import settings
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
            # Add timeout and SSL configuration
            cls.client = AsyncIOMotorClient(
                settings.mongodb_uri,
                serverSelectionTimeoutMS=10000,  # 10 second timeout
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                tls=True,
                tlsAllowInvalidCertificates=True
            )
            # Verify connection
            await cls.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            # Don't raise the exception to allow server to start
            logger.warning("Server starting without database connection")
            cls.client = None
    
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
            raise Exception("Database not connected. Please check MongoDB connection string and network access.")
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
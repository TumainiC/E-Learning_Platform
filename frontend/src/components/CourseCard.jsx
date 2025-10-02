/**
 * Course Card Component
 * Displays course information in a card format
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // Get level color for badge
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Get first letter for gradient placeholder
  const getFirstLetter = (title) => {
    return title ? title.charAt(0).toUpperCase() : 'C';
  };

  // Handle card click navigation
  const handleCardClick = () => {
    navigate(`/courses/${course.id}`);
  };

  // Truncate description to 2 lines (approximately 120 characters)
  const truncateDescription = (text, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Thumbnail Section */}
      <div className="mb-4 relative">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="text-white text-4xl font-bold">
              {getFirstLetter(course.title)}
            </div>
          </div>
        )}
        
        {/* Completion Badge */}
        {course.isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed
          </div>
        )}
      </div>
      
      {/* Course Title */}
      <h3 className="text-xl font-semibold mb-2 text-gray-900 truncate" title={course.title}>
        {course.title}
      </h3>
      
      {/* Course Description */}
      <p className="text-gray-600 mb-4 leading-relaxed" style={{ height: '3rem', overflow: 'hidden' }}>
        {truncateDescription(course.description)}
      </p>
      
      {/* Badges Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Duration Badge */}
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {course.duration}
        </span>
        
        {/* Difficulty Level Badge */}
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
          {course.level}
        </span>
      </div>
      
      {/* Course Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Instructor: {course.instructor}</span>
          <span>{course.lessonsCount} lessons</span>
        </div>
      </div>
      
      {/* Action Button */}
      <button 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click when button is clicked
          handleCardClick();
        }}
      >
        {course.isCompleted ? 'Review Course' : 'Start Learning'}
      </button>
    </div>
  );
};

export default CourseCard;
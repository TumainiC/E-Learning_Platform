/**
 * Course Card Component
 * Displays course information in a card format
 */
import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        {course.thumbnail && (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Instructor: {course.instructor}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {course.difficulty}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-sm text-gray-500">
          Duration: {course.duration} minutes
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
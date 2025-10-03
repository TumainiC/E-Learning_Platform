/**
 * Courses Page Component
 * Displays list of available courses (placeholder for now)
 */
import React from 'react';
import { useAuth } from '../context/AuthContext';

const CoursesPage = () => {
  const { user } = useAuth();

  // Placeholder courses data
  const courses = [
    {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn the basics of React development',
      duration: '4 hours',
      level: 'Beginner',
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      description: 'Master advanced JavaScript concepts',
      duration: '6 hours',
      level: 'Advanced',
    },
    {
      id: 3,
      title: 'Python for Beginners',
      description: 'Start your journey with Python programming',
      duration: '5 hours',
      level: 'Beginner',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue your learning journey with our courses
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Duration: {course.duration}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    course.level === 'Beginner' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {course.level}
                  </span>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium">
                  Start Course
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no courses) */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses available yet
            </h3>
            <p className="text-gray-600">
              Check back later for new courses!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
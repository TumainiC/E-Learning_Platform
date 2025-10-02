/**
 * Course List Page Component
 * Displays list of available courses
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CourseListPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // TODO: Replace with actual API call
      // Placeholder courses data
      const placeholderCourses = [
        {
          id: 1,
          title: 'React Fundamentals',
          description: 'Learn the basics of React development',
          instructor: 'John Doe',
          duration: 240,
          difficulty: 'Beginner',
          thumbnail: null,
        },
        {
          id: 2,
          title: 'Advanced JavaScript',
          description: 'Master advanced JavaScript concepts',
          instructor: 'Jane Smith',
          duration: 360,
          difficulty: 'Advanced',
          thumbnail: null,
        },
        {
          id: 3,
          title: 'Python for Beginners',
          description: 'Start your journey with Python programming',
          instructor: 'Bob Johnson',
          duration: 300,
          difficulty: 'Beginner',
          thumbnail: null,
        },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourses(placeholderCourses);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading courses..." />
      </div>
    );
  }

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

        {/* Error Message */}
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)} 
        />

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage;
/**
 * Course List Page Component
 * Displays list of available courses
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseAPI } from '../services/api';
import CourseCard from '../components/CourseCard';

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
      setLoading(true);
      setError(null);
      
      // Fetch courses from API
      const coursesData = await courseAPI.getCourses();
      setCourses(coursesData);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err.response?.data?.detail || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Tailwind Loading Spinner */}
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Courses
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, {user?.fullName}! Continue your learning journey
          </p>
          <div className="mt-4 w-24 h-1 bg-blue-600 mx-auto rounded"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Courses Grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-500 text-lg">Check back later for new courses.</p>
            </div>
          )
        )}

        {/* Course Statistics */}
        {courses.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{courses.length}</div>
                <div className="text-gray-600">Total Courses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {courses.filter(course => course.isCompleted).length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {courses.filter(course => !course.isCompleted).length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage;
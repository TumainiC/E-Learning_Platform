/**
 * Course Detail Page Component
 * Displays detailed information about a specific course
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course details from API
      const response = await courseAPI.getCourseById(courseId);
      setCourse(response.course); // Extract course from response object
    } catch (err) {
      console.error('Error fetching course:', err);
      setError(err.response?.data?.detail || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setMarkingComplete(true);
      setError(null);
      
      // Call API to mark course as complete
      const response = await courseAPI.markCourseComplete(courseId);
      
      // Update local state immediately (don't refetch)
      setCourse(prevCourse => ({
        ...prevCourse,
        isCompleted: true,
        completedAt: response.completion.completedAt
      }));
      
      // Show success message
      setSuccessMessage('Congratulations! Course marked as completed.');
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (err) {
      console.error('Error marking course complete:', err);
      setError(err.response?.data?.detail || 'Failed to mark course as completed');
    } finally {
      setMarkingComplete(false);
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading course details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message Toast */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-800">{successMessage}</span>
              <button 
                onClick={() => setSuccessMessage(null)}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Back Button */}
          <div className="p-6 border-b">
            <Link 
              to="/courses" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ← Back to Courses
            </Link>
          </div>

          {/* Completion Status Banner */}
          {course.isCompleted && (
            <div className="bg-green-50 border-b border-green-200 p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-green-800 font-semibold">Course Completed!</h3>
                  <p className="text-green-600">
                    Completed on {formatDate(course.completedAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Course Header */}
          <div className="p-8">
            {/* Large Course Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            
            {/* Instructor with Icon */}
            <div className="flex items-center mb-6">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 font-medium">Instructor: {course.instructor}</span>
            </div>

            {/* Course Metadata Horizontal List */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Duration: {course.duration}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-600">Lessons: {course.lessonsCount}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Course</h2>
              <div className="prose prose-gray max-w-none">
                {course.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* What You'll Learn Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
              <ul className="space-y-3">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Course Syllabus Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Syllabus</h2>
              <ol className="space-y-3">
                {course.syllabus.map((topic, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{topic}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-8 border-t bg-gray-50">
            {course.isCompleted ? (
              <button 
                disabled
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed opacity-75 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed ✓
              </button>
            ) : (
              <button 
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {markingComplete ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                    Marking Complete...
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
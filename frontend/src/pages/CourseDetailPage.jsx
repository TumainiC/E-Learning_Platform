import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { showSuccess, showError } = useToast();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(null);
  const [showCongratulations, setShowCongratulations] = useState(false);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/courses/${id}`);
      setCourse(response.data.course);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get(`/api/courses/${id}/progress`);
      setProgress(response.data);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
      fetchProgress();
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError(null);
      
      await api.post(`/api/courses/${id}/enroll`);
      
      // Show success toast
      showSuccess(`Successfully enrolled in "${course?.title}"!`);
      
      // Refresh course and progress data
      await fetchCourse();
      await fetchProgress();
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to enroll in course';
      
      // Show error toast
      if (err.response?.status === 400 && errorMessage.includes('already enrolled')) {
        showError('You are already enrolled in this course!');
      } else {
        showError(errorMessage);
      }
      
      setError(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const handleModuleComplete = async (moduleIndex) => {
    try {
      setError(null);
      
      await api.post(`/api/courses/${id}/modules/${moduleIndex}/complete`);
      
      // Show success toast for module completion
      showSuccess(`Module ${moduleIndex + 1} completed!`);
      
      await fetchProgress();
      
      const updatedProgress = await api.get(`/api/courses/${id}/progress`);
      if (updatedProgress.data.isFullyCompleted && !progress?.isFullyCompleted) {
        setShowCongratulations(true);
        showSuccess(`🎉 Congratulations! You've completed "${course?.title}"!`);
      }
      setProgress(updatedProgress.data);
      
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to mark module as completed';
      showError(errorMessage);
      setError(errorMessage);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isModuleCompleted = (moduleIndex) => {
    if (!progress?.completions) return false;
    return progress.completions.some(completion => completion.moduleIndex === moduleIndex);
  };

  const getCompletedModulesCount = () => {
    return progress?.completedModules || 0;
  };

  const getProgressPercentage = () => {
    return progress?.progressPercentage || 0;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <Link 
            to="/courses" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Congratulations Modal */}
      {showCongratulations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h3>
            <p className="text-gray-600 mb-6">
              You've successfully completed <strong>{course.title}</strong>!
            </p>
            <button
              onClick={() => setShowCongratulations(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {error}
                </h3>
              </div>
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

          {/* Progress Banner for Enrolled Users */}
          {course.isEnrolled && progress && (
            <div className="bg-blue-50 border-b border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-blue-800 font-semibold">Course Progress</h3>
                  <p className="text-blue-600">
                    {getCompletedModulesCount()} of {progress.totalModules} modules completed ({getProgressPercentage()}%)
                  </p>
                </div>
                <div className="w-32 bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Course Header */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
            
            <div className="flex items-center mb-6">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 font-medium">Instructor: {course.instructor}</span>
            </div>

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

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
              <ul className="space-y-3">
                {course.objectives?.map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Modules</h2>
              <div className="space-y-3">
                {course.syllabus?.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start flex-1">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 flex-1">{topic}</span>
                    </div>
                    
                    {course.isEnrolled && (
                      <div className="ml-4">
                        {isModuleCompleted(index) ? (
                          <div className="flex items-center text-green-600">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleModuleComplete(index)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button at Bottom */}
          <div className="p-8 border-t bg-gray-50">
            {course.isEnrolled ? (
              <div className="text-center">
                <div className="inline-flex items-center text-green-600 font-medium mb-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Enrolled in Course
                </div>
                <p className="text-gray-600">
                  Complete the modules above to finish the course
                </p>
              </div>
            ) : (
              <button 
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {enrolling ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  'Enroll in Course'
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
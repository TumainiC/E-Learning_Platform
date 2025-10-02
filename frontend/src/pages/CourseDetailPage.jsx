/**
 * Course Detail Page Component
 * Displays detailed information about a specific course
 */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      // TODO: Replace with actual API call
      // Placeholder course data
      const placeholderCourse = {
        id: courseId,
        title: 'React Fundamentals',
        description: 'Learn the basics of React development including components, state, props, and hooks. This comprehensive course will take you from beginner to confident React developer.',
        instructor: 'John Doe',
        duration: 240,
        difficulty: 'Beginner',
        thumbnail: null,
        lessons: [
          { id: 1, title: 'Introduction to React', duration: 30 },
          { id: 2, title: 'Components and JSX', duration: 45 },
          { id: 3, title: 'State and Props', duration: 60 },
          { id: 4, title: 'Event Handling', duration: 45 },
          { id: 5, title: 'React Hooks', duration: 60 },
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCourse(placeholderCourse);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {course.difficulty}
              </span>
            </div>
            <p className="text-gray-600 text-lg mb-6">{course.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Instructor: {course.instructor}</span>
              <span>Duration: {Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
              <span>Lessons: {course.lessons?.length || 0}</span>
            </div>
          </div>

          {/* Course Content */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-semibold mb-6">Course Content</h2>
            <div className="space-y-4">
              {course.lessons?.map((lesson) => (
                <div key={lesson.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-gray-500 text-sm">{lesson.duration} min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enroll Button */}
          <div className="p-8 border-t bg-gray-50">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
/**
 * Home Page Component
 * Landing page for the application
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{' '}
            <span className="text-blue-600">E-Learning Platform</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Discover new skills, expand your knowledge, and advance your career 
            with our comprehensive online courses.
          </p>
          
          <div className="mt-10 flex justify-center space-x-4">
            {isAuthenticated() ? (
              <Link
                to="/courses"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Browse Courses
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md text-lg font-medium"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Choose Our Platform?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Instructors
              </h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of experience
              </p>
            </div>

            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Flexible Learning
              </h3>
              <p className="text-gray-600">
                Study at your own pace, anytime and anywhere
              </p>
            </div>

            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Certificates
              </h3>
              <p className="text-gray-600">
                Earn certificates to showcase your new skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
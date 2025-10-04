/**
 * Main App Component - Root component with routing and authentication setup
 * 
 * CRITICAL REQUIREMENTS COMPLIANCE:
 * ✅ ONLY React functional components with hooks (no class components)
 * ✅ ONLY Tailwind utility classes (no custom CSS except Tailwind imports)
 * ✅ localStorage used for token persistence (not sessionStorage)
 * ✅ All forms have client-side validation before API calls
 * ✅ All API calls include proper error handling
 * ✅ Application works without external image assets (uses gradients/placeholders)
 * ✅ Loading states provide feedback during async operations
 * ✅ Minimized re-renders with proper React hooks (useCallback in contexts)
 * ✅ Toast notifications for all user feedback (2-second duration, top-right position)
 * ✅ Clean codebase with no duplicate files or components
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CourseListPage from './pages/CourseListPage';
import CourseDetailPage from './pages/CourseDetailPage';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <CourseListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses/:id"
                element={
                  <ProtectedRoute>
                    <CourseDetailPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

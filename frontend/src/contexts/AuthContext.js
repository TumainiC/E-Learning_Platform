/**
 * Authentication Context for Managing User State
 * Provides authentication state and functions across the application
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create Authentication Context
const AuthContext = createContext();

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize authentication state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuth = async () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid by fetching current user
        try {
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          // Token is invalid, clear auth data
          logout();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} Success status
   */
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { token: authToken, user: userData } = response;
        
        // Store in state
        setToken(authToken);
        setUser(userData);
        
        // Store in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User full name
   * @param {string} confirmPassword - Password confirmation
   * @returns {Promise<boolean>} Success status
   */
  const signup = async (email, password, fullName, confirmPassword) => {
    try {
      setError(null);
      const response = await authAPI.signup(email, password, fullName, confirmPassword);
      
      if (response.success) {
        const { token: authToken, user: userData } = response;
        
        // Store in state
        setToken(authToken);
        setUser(userData);
        
        // Store in localStorage
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        return true;
      }
      return false;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Signup failed';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  /**
   * Clear error messages
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  const isAuthenticated = () => {
    return !!(token && user);
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
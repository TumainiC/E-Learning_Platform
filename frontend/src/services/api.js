/**
 * API Service for Mini E-Learning Platform
 * Handles all HTTP requests to the backend API
 */
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (logout user)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      
      // Redirect to login page (if not already there)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} fullName - User full name
   * @param {string} confirmPassword - Password confirmation
   * @returns {Promise} API response
   */
  signup: async (email, password, fullName, confirmPassword) => {
    const response = await api.post('/api/auth/signup', {
      email,
      password,
      fullName,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} API response
   */
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Get current user information
   * @returns {Promise} API response
   */
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Course API calls (placeholder for future implementation)
export const courseAPI = {
  /**
   * Get all courses
   * @returns {Promise} API response
   */
  getCourses: async () => {
    const response = await api.get('/api/courses');
    return response.data.courses; // Extract courses array from the response
  },

  /**
   * Get course by ID
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  getCourseById: async (courseId) => {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  /**
   * Mark course as complete
   * @param {string} courseId - Course ID
   * @returns {Promise} API response
   */
  markCourseComplete: async (courseId) => {
    const response = await api.post(`/api/courses/${courseId}/complete`);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  /**
   * Check API health status
   * @returns {Promise} API response
   */
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
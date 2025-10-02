/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('userData');
  return !!(token && user);
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Get auth token from localStorage
 * @returns {string|null} Auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
};

/**
 * Store authentication data in localStorage
 * @param {string} token - Auth token
 * @param {Object} user - User object
 */
export const storeAuthData = (token, user) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userData', JSON.stringify(user));
};

/**
 * Check if token is expired (basic check)
 * @param {string} token - JWT token
 * @returns {boolean} True if token appears expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};
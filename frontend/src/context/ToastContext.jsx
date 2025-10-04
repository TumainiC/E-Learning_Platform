/**
 * Toast Context Provider
 * Manages global toast notifications throughout the application
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration: options.duration || 2000,
      position: options.position || 'top-right',
      ...options
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const showSuccess = useCallback((message, options) => {
    return addToast(message, 'success', options);
  }, [addToast]);

  const showError = useCallback((message, options) => {
    return addToast(message, 'error', options);
  }, [addToast]);

  const showWarning = useCallback((message, options) => {
    return addToast(message, 'warning', options);
  }, [addToast]);

  const showInfo = useCallback((message, options) => {
    return addToast(message, 'info', options);
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            isVisible={true}
            onClose={() => removeToast(toast.id)}
            duration={0} // Let context handle duration
            position={toast.position}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
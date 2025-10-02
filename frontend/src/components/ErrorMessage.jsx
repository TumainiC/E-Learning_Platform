/**
 * Error Message Component
 * Displays error messages with consistent styling
 */
import React from 'react';

const ErrorMessage = ({ message, onClose, type = 'error' }) => {
  const typeClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  if (!message) return null;

  return (
    <div className={`border px-4 py-3 rounded mb-4 ${typeClasses[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-lg font-semibold hover:opacity-75"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
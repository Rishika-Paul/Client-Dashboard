import React from 'react';

/**
 * Error Message Component
 */
const ErrorMessage = ({ message }) => (
    <div className="p-8 text-center">
        <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 className="text-xl font-semibold text-red-700">Failed to load data</h3>
        <p className="text-gray-600 mt-2">{message}</p>
    </div>
);

export default ErrorMessage;

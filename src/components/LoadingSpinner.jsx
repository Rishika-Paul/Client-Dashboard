import React from 'react';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="ml-4 text-gray-600 text-lg">Loading client data...</p>
    </div>
);

export default LoadingSpinner;

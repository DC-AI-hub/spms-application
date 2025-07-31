import React from 'react';

const StatCard = ({ title, description, value, asOfDate, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
      </div>
    );
  }

  // Format timestamp if available
  const formattedDate = asOfDate ? new Date(asOfDate).toLocaleString() : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm relative">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
      <p className="text-2xl font-bold text-gray-800 mt-2">
        {value !== null && value !== undefined ? value : 'N/A'}
      </p>
      
      {formattedDate && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {formattedDate}
        </div>
      )}
    </div>
  );
};

export default StatCard;

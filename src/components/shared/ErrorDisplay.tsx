import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ErrorDisplayProps {
  error: string | null;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <FontAwesomeIcon 
          icon={faExclamationTriangle} 
          className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" 
        />
        <p className="text-red-200 text-sm">{error}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;

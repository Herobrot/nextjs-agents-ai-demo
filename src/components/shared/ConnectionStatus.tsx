import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCircle, 
  faExclamationCircle, 
  faSpinner 
} from '@fortawesome/free-solid-svg-icons';

interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isConnecting,
  error
}) => {
  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isConnected) return 'text-green-500';
    if (isConnecting) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isConnected) return 'Conectado';
    if (isConnecting) return 'Conectando...';
    return 'Desconectado';
  };

  const getStatusIcon = () => {
    if (error) return faExclamationCircle;
    if (isConnecting) return faSpinner;
    return faCircle;
  };

  return (
    <div className="flex items-center space-x-2">
      <FontAwesomeIcon 
        icon={getStatusIcon()}
        className={`w-3 h-3 ${getStatusColor()} ${isConnecting ? 'animate-spin' : ''}`}
      />
      <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
    </div>
  );
};

export default ConnectionStatus;

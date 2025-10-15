import React from 'react';
import ConnectionStatus from './ConnectionStatus';

interface AgentHeaderProps {
  title: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  subtitle?: string;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({
  title,
  isConnected,
  isConnecting,
  error,
  subtitle
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
      <ConnectionStatus
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />
    </div>
  );
};

export default AgentHeader;

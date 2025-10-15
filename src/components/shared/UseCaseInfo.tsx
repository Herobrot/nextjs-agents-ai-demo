import React from 'react';

interface UseCaseInfoProps {
  title: string;
  description: string;
  additionalInfo?: string[];
}

const UseCaseInfo: React.FC<UseCaseInfoProps> = ({
  title,
  description,
  additionalInfo = []
}) => {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-2">{title}</h4>
      <p className="text-xs text-gray-400 mb-2">
        {description}
      </p>
      {additionalInfo.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {additionalInfo.map((info) => (
            <p key={info}>• {info}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default UseCaseInfo;

import React from 'react';

interface QuickActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
  title?: string;
  isVisible?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  title = 'Acciones Rápidas',
  isVisible = true
}) => {
  if (!isVisible || actions.length === 0) return null;

  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-3">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={`quick-action-${action.slice(0, 20)}-${index}`}
            onClick={() => onActionClick(action)}
            className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded-full transition-colors duration-200"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

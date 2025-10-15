import React from "react";

interface ConversationEntry {
  type: "user" | "agent";
  message: string;
  timestamp: Date;
}

interface ConversationAreaProps {
  conversationHistory: ConversationEntry[];
  emptyMessage?: string;
  height?: string;
}

const ConversationArea: React.FC<ConversationAreaProps> = ({
  conversationHistory,
  emptyMessage = "Inicia una conversación escribiendo un mensaje",
  height = "h-64",
}) => {
  return (
    <div className={`bg-gray-900 rounded-lg p-4 ${height} overflow-y-auto`}>
      <div className="space-y-3">
        {conversationHistory.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{emptyMessage}</p>
        ) : (
          conversationHistory.map((entry, index) => (
            <div
              key={`${entry.timestamp.getTime()}-${index}`}
              className={`flex ${entry.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  entry.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                <p className="text-sm">{entry.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {entry.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationArea;

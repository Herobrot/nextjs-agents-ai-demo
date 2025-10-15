import React from "react";

interface ConnectionControlsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onStartConversation: () => void;
  onStopConversation: () => void;
  onToggleMute: () => void;
  startButtonText?: string;
  stopButtonText?: string;
}

const ConnectionControls: React.FC<ConnectionControlsProps> = ({
  isConnected,
  isConnecting,
  isSpeaking,
  isListening,
  isMuted,
  onConnect,
  onDisconnect,
  onStartConversation,
  onStopConversation,
  onToggleMute,
  startButtonText = "Iniciar Conversación",
  stopButtonText = "Detener Conversación",
}) => {
  return (
    <div className="flex flex-wrap gap-3">
      {!isConnected ? (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {isConnecting ? "Conectando..." : "Conectar"}
        </button>
      ) : (
        <>
          <button
            onClick={onDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Desconectar
          </button>
          <button
            onClick={onStartConversation}
            disabled={isSpeaking || isListening}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {startButtonText}
          </button>
          <button
            onClick={onStopConversation}
            disabled={!isSpeaking && !isListening}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {stopButtonText}
          </button>
          <button
            onClick={onToggleMute}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              isMuted
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isMuted ? "Desmutear" : "Mutear"}
          </button>
        </>
      )}
    </div>
  );
};

export default ConnectionControls;

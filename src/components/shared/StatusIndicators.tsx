import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp, faEarListen } from "@fortawesome/free-solid-svg-icons";

interface StatusIndicatorsProps {
  isSpeaking: boolean;
  isListening: boolean;
  speakingText?: string;
  listeningText?: string;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isSpeaking,
  isListening,
  speakingText = "Hablando",
  listeningText = "Escuchando",
}) => {
  return (
    <div className="flex space-x-4">
      {isSpeaking && (
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <FontAwesomeIcon icon={faVolumeUp} className="w-4 h-4" />
          <span className="text-sm">{speakingText}</span>
        </div>
      )}
      {isListening && (
        <div className="flex items-center space-x-2 text-blue-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <FontAwesomeIcon icon={faEarListen} className="w-4 h-4" />
          <span className="text-sm">{listeningText}</span>
        </div>
      )}
    </div>
  );
};

export default StatusIndicators;

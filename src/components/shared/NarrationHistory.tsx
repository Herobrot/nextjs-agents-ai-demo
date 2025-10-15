import React from "react";

interface NarrationEntry {
  text: string;
  timestamp: Date;
  duration?: number;
}

interface NarrationHistoryProps {
  history: NarrationEntry[];
  title?: string;
  maxHeight?: string;
  showWordCount?: boolean;
  showDuration?: boolean;
}

const NarrationHistory: React.FC<NarrationHistoryProps> = ({
  history,
  title = "Historial de Narraciones",
  maxHeight = "max-h-48",
  showWordCount = true,
  showDuration = true,
}) => {
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getEstimatedDuration = (text: string) => {
    const words = getWordCount(text);
    const minutes = words / 150;
    return Math.max(1, Math.round(minutes * 60));
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-3">{title}</h4>
      <div className={`space-y-3 ${maxHeight} overflow-y-auto`}>
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No hay narraciones aún
          </p>
        ) : (
          history.map((entry, index) => (
            <div
              key={`narration-${entry.timestamp.getTime()}-${index}`}
              className="bg-gray-800 rounded-lg p-3"
            >
              <p className="text-sm text-gray-200 mb-2">{entry.text}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{entry.timestamp.toLocaleTimeString()}</span>
                <span>
                  {showWordCount && showDuration && (
                    <>
                      {getWordCount(entry.text)} palabras (~
                      {entry.duration || getEstimatedDuration(entry.text)}s)
                    </>
                  )}
                  {showWordCount && !showDuration && (
                    <>{getWordCount(entry.text)} palabras</>
                  )}
                  {!showWordCount && showDuration && (
                    <>~{entry.duration || getEstimatedDuration(entry.text)}s</>
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NarrationHistory;

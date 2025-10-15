import React from "react";

interface NarrationTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  showWordCount?: boolean;
  showDuration?: boolean;
}

const NarrationTextArea: React.FC<NarrationTextAreaProps> = ({
  value,
  onChange,
  onKeyUp,
  placeholder = "Escribe aquí el texto que quieres que sea narrado...",
  disabled = false,
  rows = 4,
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
    <div className="space-y-3">
      <label
        htmlFor="narration-text"
        className="block text-sm font-medium text-gray-300"
      >
        Texto para Narrar
      </label>
      <textarea
        id="narration-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={onKeyUp}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
      />
      {value && (showWordCount || showDuration) && (
        <div className="flex justify-between text-xs text-gray-400">
          {showWordCount && <span>{getWordCount(value)} palabras</span>}
          {showDuration && (
            <span>
              Duración estimada: ~{getEstimatedDuration(value)} segundos
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default NarrationTextArea;

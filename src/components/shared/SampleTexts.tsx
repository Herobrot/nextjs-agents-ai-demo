import React from 'react';

interface SampleText {
  text: string;
  wordCount?: number;
  estimatedDuration?: number;
}

interface SampleTextsProps {
  samples: SampleText[];
  onSampleClick: (sample: string) => void;
  title?: string;
  isVisible?: boolean;
  showWordCount?: boolean;
  showDuration?: boolean;
}

const SampleTexts: React.FC<SampleTextsProps> = ({
  samples,
  onSampleClick,
  title = 'Textos de Ejemplo',
  isVisible = true,
  showWordCount = true,
  showDuration = true
}) => {
  if (!isVisible || samples.length === 0) return null;

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getEstimatedDuration = (text: string) => {    
    const words = getWordCount(text);
    const minutes = words / 150;
    return Math.max(1, Math.round(minutes * 60));
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {samples.map((sample, index) => (
          <button
            key={`sample-${sample.text.slice(0, 30)}-${index}`}
            onClick={() => onSampleClick(sample.text)}
            className="w-full text-left bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs p-3 rounded-lg transition-colors duration-200"
          >
            <div className="flex justify-between items-start">
              <span className="flex-1">{sample.text}</span>
              <span className="text-gray-400 ml-2 text-xs">
                {showWordCount && showDuration && (
                  <>
                    {sample.wordCount || getWordCount(sample.text)} palabras (~{sample.estimatedDuration || getEstimatedDuration(sample.text)}s)
                  </>
                )}
                {showWordCount && !showDuration && (
                  <>
                    {sample.wordCount || getWordCount(sample.text)} palabras
                  </>
                )}
                {!showWordCount && showDuration && (
                  <>
                    ~{sample.estimatedDuration || getEstimatedDuration(sample.text)}s
                  </>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleTexts;

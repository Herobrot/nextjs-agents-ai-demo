import React from 'react';

interface PlatformSelectorProps {
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selectedValue, onChange }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="platform-selector" className="text-white font-medium">
          Plataforma:
        </label>
        <select
          id="platform-selector"
          value={selectedValue}
          onChange={onChange}
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="elevenlabs">ElevenLabs</option>
          <option value="vapi">VAPI</option>
          <option value="comparison">Comparación Lado a Lado</option>
        </select>
      </div>
    </div>
  );
};

export default PlatformSelector;

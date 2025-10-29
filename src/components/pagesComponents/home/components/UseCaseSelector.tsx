import React from "react";

interface UseCaseSelectorProps {
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const UseCaseSelector = ({ selectedValue, onChange }: UseCaseSelectorProps) => {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <select
          value={selectedValue}
          onChange={onChange}
          className="bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-xl px-8 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-700/90 transition-all duration-300 min-w-[350px] text-lg font-medium shadow-lg appearance-none"
        >
          <option value="atencion-cliente">Atención al Cliente</option>
          <option value="atencion-cliente-computadoras">
            Atención al Cliente - Computadoras
          </option>
          <option value="asistente-virtual">Asistente Virtual</option>
          <option value="narracion-contenidos">Narración de Contenidos</option>
          <option value="entrevistador">Entrevistador</option>
          <option value="entrevistador-alimentos">Entrevistador de Alimentos</option>
          <option value="test">Test VAPI</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UseCaseSelector;

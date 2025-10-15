import React from 'react';

const Header = () => {
  return (
    <header className="py-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ElevenLabs Agent Testing
          </h1>
        </div>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Plataforma de pruebas para agentes de voz inteligentes
        </p>
      </div>
    </header>
  );
};

export default Header;
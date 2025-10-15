import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const VapiTest: React.FC = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const [error, setError] = useState<string | null>(null);

  // API Key y Assistant ID para pruebas
  const apiKey = process.env.VAPI_API_KEY || 'vapi_1234';
  const assistantId = 'd20d5162-d1ae-46b5-be58-fe4dae294a10';

  useEffect(() => {
    console.log('VapiTest - API Key:', apiKey);
    console.log('VapiTest - Assistant ID:', assistantId);
    
    if (!apiKey || apiKey === 'vapi_1234') {
      setError('API Key no configurada correctamente');
      return;
    }

    const vapiInstance = new Vapi(apiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
      setError(null);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message: any) => {
      console.log('Vapi message:', message);
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
      }
    });

    vapiInstance.on('error', (error: any) => {
      console.error('Vapi error:', error);
      setError(error.message || 'Error desconocido');
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [apiKey]);

  const startCall = () => {
    if (vapi) {
      console.log('Starting call with assistant:', assistantId);
      vapi.start(assistantId);
    }
  };

  const endCall = () => {
    if (vapi) {
      console.log('Ending call');
      vapi.stop();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">VAPI Test Component</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <span className={`text-sm ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-gray-900/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Información de Debug</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p>API Key: {apiKey ? `${apiKey.substring(0, 10)}...` : 'No configurada'}</p>
          <p>Assistant ID: {assistantId}</p>
          <p>Environment: {process.env.NODE_ENV}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {!isConnected ? (
          <button
            onClick={startCall}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            🎤 Iniciar Llamada
          </button>
        ) : (
          <button
            onClick={endCall}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            📞 Terminar Llamada
          </button>
        )}
      </div>

      {isSpeaking && (
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Asistente hablando...</span>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
        <div className="space-y-3">
          {transcript.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              La conversación aparecerá aquí...
            </p>
          ) : (
            transcript.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VapiTest;

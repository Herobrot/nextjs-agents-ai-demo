import React, { useState } from 'react';
import { useElevenLabsAgent } from '../../../../hooks/useElevenLabs';

const ElevenLabsAtencionClienteComputadoras = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'agent';
    message: string;
    timestamp: Date;
  }>>([]);
  const [quickQuestions] = useState([
    '¿Qué procesador me recomiendas para gaming?',
    '¿Es compatible esta placa base con mi CPU?',
    '¿Cuánta RAM necesito para streaming?',
    '¿Qué tarjeta gráfica es mejor para mi presupuesto?',
    '¿Necesito una fuente de alimentación más potente?'
  ]);

  const {
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    error,
    connect,
    disconnect,
    startConversation,
    stopConversation,
    sendMessage,
    toggleMute,
    isMuted
  } = useElevenLabsAgent('atencion-cliente-computadoras');

  const handleSendMessage = () => {
    if (userMessage.trim() && isConnected) {      
      setConversationHistory(prev => [...prev, {
        type: 'user',
        message: userMessage,
        timestamp: new Date()
      }]);
        
      sendMessage(userMessage);
      setUserMessage('');
    }
  };

  const handleQuickQuestion = (question: string) => {
    if (isConnected) {
      setConversationHistory(prev => [...prev, {
        type: 'user',
        message: question,
        timestamp: new Date()
      }]);
      sendMessage(question);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isConnected) return 'text-green-500';
    if (isConnecting) return 'text-yellow-500';
    return 'text-gray-500';
  };

  const getStatusText = () => {
    if (error) return 'Error';
    if (isConnected) return 'Conectado';
    if (isConnecting) return 'Conectando...';
    return 'Desconectado';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Atención al Cliente - Computadoras</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor().replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Controles de conexión */}
      <div className="flex flex-wrap gap-3">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {isConnecting ? 'Conectando...' : 'Conectar'}
          </button>
        ) : (
          <>
            <button
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Desconectar
            </button>
            <button
              onClick={startConversation}
              disabled={isSpeaking || isListening}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Iniciar Consulta
            </button>
            <button
              onClick={stopConversation}
              disabled={!isSpeaking && !isListening}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Finalizar Consulta
            </button>
            <button
              onClick={toggleMute}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isMuted 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isMuted ? 'Desmutear' : 'Mutear'}
            </button>
          </>
        )}
      </div>

      {/* Indicadores de estado */}
      <div className="flex space-x-4">
        {isSpeaking && (
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">José está respondiendo</span>
          </div>
        )}
        {isListening && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Escuchando tu consulta</span>
          </div>
        )}
      </div>

      {/* Preguntas rápidas */}
      {isConnected && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Preguntas Frecuentes</h4>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question) => (
              <button
                key={`question-${question.slice(0, 30)}`}
                onClick={() => handleQuickQuestion(question)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded-full transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Área de conversación */}
      <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
        <div className="space-y-3">
          {conversationHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">¡Hola! Soy José de TecnoNeuro</p>
              <p className="text-gray-500 text-sm">¿En qué puedo ayudarte con tu PC hoy?</p>
            </div>
          ) : (
            conversationHistory.map((entry, index) => (
              <div
                key={`${entry.timestamp.getTime()}-${index}`}
                className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    entry.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-200'
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

      {/* Input de mensaje */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Describe tu consulta sobre componentes de PC..."
          disabled={!isConnected}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !userMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Enviar
        </button>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Especialista en Hardware</h4>
        <p className="text-xs text-gray-400">
          José es tu especialista en componentes de PC con amplia experiencia en CPU, GPU, 
          placas base, RAM, almacenamiento y más. Te ayudará a encontrar la configuración 
          perfecta para tus necesidades y presupuesto.
        </p>
      </div>
    </div>
  );
};

export default ElevenLabsAtencionClienteComputadoras;

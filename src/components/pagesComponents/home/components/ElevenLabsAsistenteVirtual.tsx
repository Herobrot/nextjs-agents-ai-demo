import React, { useState } from 'react';
import { useElevenLabsAgent } from '../../../../hooks/useElevenLabs';
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  QuickActions,
  ConversationArea,
  MessageInput,
  ErrorDisplay,
  UseCaseInfo,
  MicButton
} from '../../../../components/shared';

const ElevenLabsAsistenteVirtual = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'agent';
    message: string;
    timestamp: Date;
  }>>([]);
  const [quickActions] = useState([
    '¿Qué puedes hacer por mí?',
    'Cuéntame sobre el clima',
    'Ayúdame con una tarea',
    'Explícame algo',
    'Cuéntame un chiste'
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
  } = useElevenLabsAgent('asistente-virtual');

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

  const handleQuickAction = (action: string) => {
    if (isConnected) {
      setConversationHistory(prev => [...prev, {
        type: 'user',
        message: action,
        timestamp: new Date()
      }]);
      sendMessage(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <AgentHeader
        title="Asistente Virtual"
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />

      <ErrorDisplay error={error} />

      <ConnectionControls
        isConnected={isConnected}
        isConnecting={isConnecting}
        isSpeaking={isSpeaking}
        isListening={isListening}
        isMuted={isMuted}
        onConnect={connect}
        onDisconnect={disconnect}
        onStartConversation={startConversation}
        onStopConversation={stopConversation}
        onToggleMute={toggleMute}
      />

      <StatusIndicators
        isSpeaking={isSpeaking}
        isListening={isListening}
      />

      {/* Botón de micrófono */}
      <div className="flex justify-center">
        <MicButton
          isConnected={isConnected}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          size="lg"
        />
      </div>

      <QuickActions
        actions={quickActions}
        onActionClick={handleQuickAction}
        isVisible={isConnected}
      />

      <ConversationArea
        conversationHistory={conversationHistory}
        emptyMessage="¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
      />

      <MessageInput
        value={userMessage}
        onChange={setUserMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        placeholder="Pregúntame cualquier cosa..."
        disabled={!isConnected}
      />

      <UseCaseInfo
        title="Información del Caso de Uso"
        description="Este asistente virtual está diseñado para conversaciones generales con capacidades conversacionales avanzadas. Configura el agentId y el prompt inicial en el archivo de configuración para personalizar su comportamiento."
      />
    </div>
  );
};

export default ElevenLabsAsistenteVirtual;

import React, { useState } from 'react';
import { useVapiAgent } from '../../../../hooks/useVapi';
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

const VapiAtencionClienteComputadoras = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'agent';
    message: string;
    timestamp: Date;
  }>>([]);
  const [quickActions] = useState([
    '¿Qué procesador me recomiendas?',
    'Necesito ayuda con compatibilidad',
    '¿Cuál es la mejor GPU para gaming?',
    'Ayúdame a armar una PC',
    '¿Qué fuente de poder necesito?'
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
    isMuted,
    callId,
    callStatus
  } = useVapiAgent('atencion-cliente-computadoras');

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
        title="José - TecnoNeuro (VAPI)"
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />

      {/* Información de la llamada */}
      {callId && (
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-200 text-sm font-medium">ID de Llamada: {callId}</p>
              <p className="text-blue-300 text-xs">Estado: {callStatus}</p>
            </div>
            <div className="text-blue-400 text-xs">
              Plataforma: VAPI
            </div>
          </div>
        </div>
      )}

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
        title="Consultas Técnicas"
        isVisible={isConnected}
      />

      <ConversationArea
        conversationHistory={conversationHistory}
        emptyMessage="¡Hola! Soy José de TecnoNeuro con VAPI. ¿En qué puedo ayudarte con tu PC hoy?"
      />

      <MessageInput
        value={userMessage}
        onChange={setUserMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        placeholder="Describe tu consulta técnica..."
        disabled={!isConnected}
      />

      <UseCaseInfo
        title="Información del Caso de Uso"
        description="José es un especialista en soporte técnico de TecnoNeuro con amplios conocimientos en hardware para PC usando VAPI. Puede ayudarte con procesadores, tarjetas gráficas, placas base, RAM, almacenamiento y más."
        additionalInfo={[
          'Plataforma: VAPI',
          'Modelo: GPT-4o',
          'Transcripción: Deepgram',
          'Voz: ElevenLabs',
          'Especialidad: Hardware de PC'
        ]}
      />
    </div>
  );
};

export default VapiAtencionClienteComputadoras;

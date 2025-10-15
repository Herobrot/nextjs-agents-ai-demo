import React, { useState } from "react";
import { useElevenLabsAgent } from "../../../../hooks/useElevenLabs";
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  ConversationArea,
  MessageInput,
  ErrorDisplay,
  UseCaseInfo,
  MicButton,
} from "../../../../components/shared";

const ElevenLabsAtencionCliente = () => {
  const [userMessage, setUserMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "agent";
      message: string;
      timestamp: Date;
    }>
  >([]);

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
  } = useElevenLabsAgent("atencion-cliente");

  const handleSendMessage = () => {
    if (userMessage.trim() && isConnected) {
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "user",
          message: userMessage,
          timestamp: new Date(),
        },
      ]);

      sendMessage(userMessage);
      setUserMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <AgentHeader
        title="Atención al Cliente"
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

      <StatusIndicators isSpeaking={isSpeaking} isListening={isListening} />

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

      <ConversationArea
        conversationHistory={conversationHistory}
        emptyMessage="Inicia una conversación escribiendo un mensaje"
      />

      <MessageInput
        value={userMessage}
        onChange={setUserMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        placeholder="Escribe tu mensaje aquí..."
        disabled={!isConnected}
      />

      <UseCaseInfo
        title="Información del Caso de Uso"
        description="Este agente está configurado para atención al cliente con voz optimizada para interacciones profesionales y claras. Configura el agentId y el prompt inicial en el archivo de configuración."
      />
    </div>
  );
};

export default ElevenLabsAtencionCliente;

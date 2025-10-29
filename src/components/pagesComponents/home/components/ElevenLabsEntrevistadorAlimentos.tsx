import React, { useEffect, useState } from "react";
import { useElevenLabsAgent } from "../../../../hooks/useElevenLabs";
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  ErrorDisplay,
  MicButton,
  InterviewTimer,
} from "../../../../components/shared";

const ElevenLabsEntrevistadorAlimentos = () => {
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);

  const handleInterviewComplete = (
    reason: "completed" | "time_up" | "candidate_request",
    message?: string,
  ) => {
    setIsInterviewFinished(true);
    console.log(
      `Entrevista finalizada: ${reason}`,
      message ? `- ${message}` : "",
    );
  };

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
    conversationTime,
    timeRemaining,
  } = useElevenLabsAgent("entrevistador-alimentos", handleInterviewComplete);

  // SOLUCIÓN: Detectar automáticamente cuando la conversación ha iniciado
  useEffect(() => {
    // Si hay actividad de conversación (speaking o listening), marcar como iniciada
    if (
      isConnected &&
      (isSpeaking || isListening || conversationTime > 0) &&
      !hasInterviewStarted
    ) {
      setHasInterviewStarted(true);
    }
  }, [
    isConnected,
    isSpeaking,
    isListening,
    conversationTime,
    hasInterviewStarted,
  ]);

  // Resetear estados cuando se desconecta
  useEffect(() => {
    if (!isConnected) {
      setHasInterviewStarted(false);
      setIsInterviewFinished(false);
    }
  }, [isConnected]);

  const handleTimeUp = () => {
    // Cuando se acaba el tiempo, enviar mensaje de finalización
    if (isConnected) {
      sendMessage("Gracias por tu tiempo, la entrevista ha terminado.");
      setIsInterviewFinished(true);
    }
  };

  const handleStartConversation = () => {
    startConversation();
    setHasInterviewStarted(true);
    setIsInterviewFinished(false);
  };

  const handleStopConversation = () => {
    stopConversation();
    setIsInterviewFinished(true);
  };

  const getInterviewPhase = () => {
    if (!isConnected) return "Desconectado";
    if (!hasInterviewStarted) return "Conectado";
    if (isInterviewFinished) return "Finalizada";
    if (conversationTime > 0) return "Entrevista";
    return "Completada";
  };

  const getPhaseDescription = () => {
    const phase = getInterviewPhase();
    switch (phase) {
      case "Desconectado":
        return "Conecta el agente para comenzar la entrevista";
      case "Conectado":
        return "Esperando que el agente inicie la conversación...";
      case "Entrevista":
        return "La entrevista ha comenzado, platique con el agente.";
      case "Finalizada":
        return "La entrevista ha terminado. ¡Gracias por tu tiempo!";
      default:
        return "Entrevista completada";
    }
  };

  const getTimerContainerStyles = () => {
    if (!isConnected) return "bg-red-900/30 border border-red-500/50";
    if (!hasInterviewStarted) return "bg-blue-900/30 border border-blue-500/50";
    if (isInterviewFinished) return "bg-gray-900/50 border border-gray-500/50";
    return "bg-gray-900/50";
  };

  const getTimerTitleStyles = () => {
    if (!isConnected) return "text-red-300";
    if (!hasInterviewStarted) return "text-blue-300";
    if (isInterviewFinished) return "text-gray-300";
    return "text-white";
  };

  const getTimerTitle = () => {
    if (!isConnected) return "Entrevista Desconectada";
    if (!hasInterviewStarted) return "Entrevista Conectada";
    if (isInterviewFinished) return "Entrevista Finalizada";
    return "Entrevista en Progreso";
  };

  const getStatusStyles = () => {
    if (!isConnected) return "text-red-400";
    if (!hasInterviewStarted) return "text-blue-400";
    if (isInterviewFinished) return "text-gray-400";
    return "text-green-400";
  };

  const getCircleStyles = () => {
    if (!isConnected) return "border-red-500 bg-red-900/20";
    if (!hasInterviewStarted) return "border-blue-500 bg-blue-900/20";
    return "border-gray-500 bg-gray-900/20";
  };

  const getCircleIconStyles = () => {
    if (!isConnected) return "text-red-400";
    if (!hasInterviewStarted) return "text-blue-400";
    return "text-gray-400";
  };

  const getCircleIcon = () => {
    if (!isConnected) return "✕";
    if (!hasInterviewStarted) return "⏳";
    return "✓";
  };

  const getCircleText = () => {
    if (!isConnected) return "Desconectado";
    if (!hasInterviewStarted) return "Esperando";
    return "Finalizada";
  };

  const getCircleMessageStyles = () => {
    if (!isConnected) return "text-red-300";
    if (!hasInterviewStarted) return "text-blue-300";
    return "text-gray-300";
  };

  const getCircleMessage = () => {
    if (!isConnected) return "Conecta el agente para comenzar";
    if (!hasInterviewStarted)
      return "El agente está iniciando la conversación...";
    return "La entrevista ha terminado";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <AgentHeader
        title="Santiago Morales - Representante Comercial"
        subtitle="Entrevista Express de 90 segundos"
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />

      <ErrorDisplay error={error} />

      {/* Temporizador de entrevista */}
      <div className={`rounded-lg p-6 ${getTimerContainerStyles()}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className={`text-lg font-semibold ${getTimerTitleStyles()}`}>
              {getTimerTitle()}
            </h4>
            <p className="text-sm text-gray-400">{getPhaseDescription()}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Estado:</div>
            <div className={`text-lg font-semibold ${getStatusStyles()}`}>
              {getInterviewPhase()}
            </div>
          </div>
        </div>

        {/* CAMBIO CLAVE: Mostrar timer cuando hay actividad de conversación */}
        {isConnected && hasInterviewStarted && !isInterviewFinished ? (
          <InterviewTimer
            timeRemaining={timeRemaining}
            maxTime={90}
            isActive={isConnected && (isSpeaking || isListening)}
            onTimeUp={handleTimeUp}
            className="mx-auto"
          />
        ) : (
          <div className="text-center py-8">
            <div
              className={`w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center ${getCircleStyles()}`}
            >
              <div className="text-center">
                <div className={`text-2xl font-bold ${getCircleIconStyles()}`}>
                  {getCircleIcon()}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {getCircleText()}
                </div>
              </div>
            </div>
            <p className={`mt-4 text-sm ${getCircleMessageStyles()}`}>
              {getCircleMessage()}
            </p>
          </div>
        )}
      </div>

      <ConnectionControls
        isConnected={isConnected}
        isConnecting={isConnecting}
        isSpeaking={isSpeaking}
        isListening={isListening}
        isMuted={isMuted}
        onConnect={connect}
        onDisconnect={disconnect}
        onStartConversation={handleStartConversation}
        onStopConversation={handleStopConversation}
        onToggleMute={toggleMute}
        startButtonText="Iniciar Entrevista"
        stopButtonText="Finalizar Entrevista"
      />

      <StatusIndicators
        isSpeaking={isSpeaking}
        isListening={isListening}
        speakingText="Entrevistadora habla"
        listeningText="Esperando tu respuesta"
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
    </div>
  );
};

export default ElevenLabsEntrevistadorAlimentos;
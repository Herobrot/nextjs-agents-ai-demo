import React, { useState, useEffect, useRef } from "react";
import { useVapiAgent } from "../../../../hooks/useVapi";
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  ConversationArea,
  MessageInput,
  ErrorDisplay,
  UseCaseInfo,
  MicButton,
  InterviewTimer,
  MicIndicator
} from "../../../../components/shared";

const VapiEntrevistador = () => {
  const [userMessage, setUserMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "agent";
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [conversationTime, setConversationTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90);
  
  // Estados para tracking de transcripción del usuario
  const [currentUserSpeechStart, setCurrentUserSpeechStart] = useState<number>(0);
  const [accumulatedUserTranscript, setAccumulatedUserTranscript] = useState("");
  const userSpeechTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    userTranscript,
    isUserSpeaking,
    clearUserTranscript,
  } = useVapiAgent("entrevistador");

  // Acumular transcripciones del usuario mientras habla
  useEffect(() => {
    if (isUserSpeaking && userTranscript) {
      setAccumulatedUserTranscript(userTranscript);
      console.log("📝 Transcripción acumulada:", userTranscript);
    }
  }, [isUserSpeaking, userTranscript]);

  // Detectar cuando el usuario comienza a hablar y establecer timer de 30s
  useEffect(() => {
    if (isUserSpeaking && currentUserSpeechStart === 0) {
      const startTime = Date.now();
      setCurrentUserSpeechStart(startTime);
      console.log("🎤 Usuario comenzó a hablar - iniciando timer de 30s");

      // Establecer timer para interrumpir después de 30 segundos
      userSpeechTimerRef.current = setTimeout(() => {
        console.log("⏰ 30 segundos alcanzados - enviando señal de interrupción al agente");
        
        // Guardar lo que dijo hasta ahora
        if (accumulatedUserTranscript) {
          setConversationHistory((prev) => [
            ...prev,
            {
              type: "user",
              message: accumulatedUserTranscript,
              timestamp: new Date(),
            },
          ]);
        }

        // SOLUCIÓN: Enviar un mensaje explícito al agente para que tome el turno
        // Este mensaje es como un "comando" para que el agente interrumpa
        sendMessage("INTERRUPCION_30_SEGUNDOS: El usuario ha estado hablando por 30 segundos. Por favor, interrumpe cortésmente y pasa a la siguiente pregunta.");
        
        console.log("📤 Señal de interrupción enviada al agente");
        
        // Limpiar
        setAccumulatedUserTranscript("");
        clearUserTranscript();
        setCurrentUserSpeechStart(0);
      }, 30000); // 30 segundos
    }

    // Limpiar timer si el usuario deja de hablar antes de 30s
    if (!isUserSpeaking && currentUserSpeechStart > 0) {
      const speakingDuration = (Date.now() - currentUserSpeechStart) / 1000;
      console.log(`🎤 Usuario dejó de hablar después de ${speakingDuration.toFixed(1)}s`);
      
      // Solo guardar si NO fue interrumpido (menos de 30s)
      if (speakingDuration < 30 && accumulatedUserTranscript) {
        setConversationHistory((prev) => [
          ...prev,
          {
            type: "user",
            message: accumulatedUserTranscript,
            timestamp: new Date(),
          },
        ]);
        console.log("💾 Transcripción guardada:", accumulatedUserTranscript);
      }

      // Limpiar timer y estados
      if (userSpeechTimerRef.current) {
        clearTimeout(userSpeechTimerRef.current);
        userSpeechTimerRef.current = null;
      }
      setAccumulatedUserTranscript("");
      clearUserTranscript();
      setCurrentUserSpeechStart(0);
    }

    // Cleanup
    return () => {
      if (userSpeechTimerRef.current) {
        clearTimeout(userSpeechTimerRef.current);
        userSpeechTimerRef.current = null;
      }
    };
  }, [isUserSpeaking, currentUserSpeechStart, accumulatedUserTranscript, sendMessage, clearUserTranscript]);

  // Detectar cuando la entrevista comienza
  useEffect(() => {
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
      setConversationTime(0);
      setTimeRemaining(90);
      setCurrentUserSpeechStart(0);
      setAccumulatedUserTranscript("");
      
      if (userSpeechTimerRef.current) {
        clearTimeout(userSpeechTimerRef.current);
        userSpeechTimerRef.current = null;
      }
    }
  }, [isConnected]);

  // Timer de la entrevista
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isConnected && hasInterviewStarted && !isInterviewFinished) {
      interval = setInterval(() => {
        setConversationTime((prev) => {
          const newTime = prev + 1;
          setTimeRemaining(90 - newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected, hasInterviewStarted, isInterviewFinished]);

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

  const handleTimeUp = () => {
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
    if (conversationTime <= 30) return "Experiencia";
    if (conversationTime <= 60) return "Desafíos";
    if (conversationTime <= 90) return "Motivación";
    return "Completada";
  };

  const getPhaseDescription = () => {
    const phase = getInterviewPhase();
    switch (phase) {
      case "Desconectado":
        return "Conecta el agente para comenzar la entrevista";
      case "Conectado":
        return "Esperando que el agente inicie la conversación...";
      case "Experiencia":
        return "Cuéntanos sobre tu experiencia y logros más importantes";
      case "Desafíos":
        return "Describe cómo manejas situaciones desafiantes";
      case "Motivación":
        return "Comparte tu motivación y expectativas para el puesto";
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

  const getEmptyMessage = () => {
    if (!isConnected) return "Conecta el agente para comenzar la entrevista";
    if (!hasInterviewStarted) return "Conectando con María de TalentConnect...";
    if (isInterviewFinished)
      return "La entrevista ha terminado. ¡Gracias por tu tiempo!";
    return "¡Hola! Soy María de TalentConnect. Gracias por tu tiempo. Tenemos 90 segundos para conocerte mejor. ¿Estás listo para comenzar la entrevista?";
  };

  const getInputPlaceholder = () => {
    if (!isConnected) return "Conecta el agente para comenzar...";
    if (!hasInterviewStarted) return "Esperando que inicie la conversación...";
    if (isInterviewFinished) return "La entrevista ha terminado";
    return "Responde las preguntas de la entrevista...";
  };

  const getSpeechDuration = () => {
    if (currentUserSpeechStart === 0) return 0;
    return Math.floor((Date.now() - currentUserSpeechStart) / 1000);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <AgentHeader
        title="María - Entrevistadora de TalentConnect (VAPI)"
        subtitle="Entrevista Express de 90 segundos"
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />

      <ErrorDisplay error={error} />

      <MicIndicator
        isUserSpeaking={isUserSpeaking}
        transcript={accumulatedUserTranscript}
        speechDuration={getSpeechDuration()}
        maxDuration={30}
        warningThreshold={25}
      />

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

      {/* Área de conversación */}
      <ConversationArea
        conversationHistory={conversationHistory}
        emptyMessage={getEmptyMessage()}
        height="h-80"
      />

      {/* Input de mensaje */}
      <MessageInput
        value={userMessage}
        onChange={setUserMessage}
        onSend={handleSendMessage}
        onKeyPress={handleKeyPress}
        placeholder={getInputPlaceholder()}
        disabled={!isConnected || !hasInterviewStarted || isInterviewFinished}
        buttonText="Responder"
      />

      {/* Información adicional */}
      <UseCaseInfo
        title="Información de la Entrevista"
        description="María es una entrevistadora experta de TalentConnect México con más de 8 años de experiencia. Esta entrevista express de 90 segundos evalúa tus competencias clave a través de 3 preguntas estructuradas: experiencia relevante, manejo de desafíos y motivación para el puesto."
        additionalInfo={[
          "Duración: 90 segundos máximo",
          "Formato: Entrevista estructurada",
          "Evaluación: Competencias clave",
          "Estilo: Directo y eficiente",
          "Objetivo: Evaluación rápida de candidatos",
          "⚡ Interrupción automática después de 30 segundos hablando",
        ]}
      />

      {/* Instrucciones para el candidato */}
      <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-2">
          Instrucciones para el Candidato
        </h4>
        <div className="text-xs text-blue-200 space-y-1">
          <p>• Mantén tus respuestas concisas y específicas</p>
          <p>• Proporciona ejemplos concretos cuando sea posible</p>
          <p>
            • ⚡ María te interrumpirá cortésmente si hablas por más de 30 segundos
          </p>
          <p>• Al final tendrás oportunidad de hacer una pregunta rápida</p>
          <p>• El tiempo total es de 90 segundos máximo</p>
        </div>
      </div>
    </div>
  );
};

export default VapiEntrevistador;
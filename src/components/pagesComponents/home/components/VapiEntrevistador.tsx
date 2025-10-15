import React, { useState, useEffect } from 'react';
import { useVapiAgent } from '../../../../hooks/useVapi';
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  ConversationArea,
  MessageInput,
  ErrorDisplay,
  UseCaseInfo,
  MicButton,
  InterviewTimer
} from '../../../../components/shared';

const VapiEntrevistador = () => {
  const [userMessage, setUserMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'agent';
    message: string;
    timestamp: Date;
  }>>([]);
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [conversationTime, setConversationTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [timerActive, setTimerActive] = useState(false);

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
    callStatus
  } = useVapiAgent('entrevistador');

  // Timer para la entrevista - CORREGIDO: Usa timerActive en lugar de hasInterviewStarted
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && !isInterviewFinished) {
      interval = setInterval(() => {
        setConversationTime(prev => {
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
  }, [timerActive, isInterviewFinished]);

  // Monitorear cambios en isConnected para activar el timer correctamente
  useEffect(() => {
    if (isConnected && hasInterviewStarted && !isInterviewFinished) {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [isConnected, hasInterviewStarted, isInterviewFinished]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartConversation = () => {
    startConversation();
    setHasInterviewStarted(true);
    setIsInterviewFinished(false);
    setConversationTime(0);
    setTimeRemaining(90);
    setTimerActive(true);
  };

  const handleStopConversation = () => {
    stopConversation();
    setIsInterviewFinished(true);
    setTimerActive(false);
  };

  const getInterviewPhase = () => {
    if (!isConnected) return 'Desconectado';
    if (!hasInterviewStarted) return 'No Iniciada';
    if (isInterviewFinished) return 'Finalizada';
    if (conversationTime <= 30) return 'Experiencia';
    if (conversationTime <= 60) return 'Desafíos';
    if (conversationTime <= 90) return 'Motivación';
    return 'Finalizada';
  };

  const getPhaseDescription = () => {
    const phase = getInterviewPhase();
    switch (phase) {
      case 'Desconectado':
        return 'Conecta el agente para comenzar la entrevista';
      case 'No Iniciada':
        return 'Presiona "Iniciar Entrevista" para comenzar';
      case 'Experiencia':
        return 'Cuéntanos sobre tu experiencia y logros más importantes';
      case 'Desafíos':
        return 'Describe cómo manejas situaciones desafiantes';
      case 'Motivación':
        return 'Comparte tu motivación y expectativas para el puesto';
      case 'Finalizada':
        return 'La entrevista ha terminado. ¡Gracias por tu tiempo!';
      default:
        return 'Entrevista completada';
    }
  };

  const getTimerContainerStyles = () => {
    if (!isConnected) return 'bg-red-900/30 border border-red-500/50';
    if (!hasInterviewStarted) return 'bg-yellow-900/30 border border-yellow-500/50';
    if (isInterviewFinished) return 'bg-gray-900/50 border border-gray-500/50';
    return 'bg-blue-900/30 border border-blue-500/50';
  };

  const getTimerTitleStyles = () => {
    if (!isConnected) return 'text-red-300';
    if (!hasInterviewStarted) return 'text-yellow-300';
    if (isInterviewFinished) return 'text-gray-300';
    return 'text-blue-300';
  };

  const getTimerTitle = () => {
    if (!isConnected) return 'Entrevista Desconectada';
    if (!hasInterviewStarted) return 'Entrevista Lista';
    if (isInterviewFinished) return 'Entrevista Finalizada';
    return 'Entrevista en Progreso';
  };

  const getStatusStyles = () => {
    if (!isConnected) return 'text-red-400';
    if (!hasInterviewStarted) return 'text-yellow-400';
    if (isInterviewFinished) return 'text-gray-400';
    return 'text-blue-400';
  };

  const getCircleStyles = () => {
    if (!isConnected) return 'border-red-500 bg-red-900/20';
    if (!hasInterviewStarted) return 'border-yellow-500 bg-yellow-900/20';
    return 'border-gray-500 bg-gray-900/20';
  };

  const getCircleIconStyles = () => {
    if (!isConnected) return 'text-red-400';
    if (!hasInterviewStarted) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getCircleIcon = () => {
    if (!isConnected) return '!';
    if (!hasInterviewStarted) return '▶';
    return '✓';
  };

  const getCircleText = () => {
    if (!isConnected) return 'Desconectado';
    if (!hasInterviewStarted) return 'Listo';
    return 'Finalizada';
  };

  const getCircleMessageStyles = () => {
    if (!isConnected) return 'text-red-300';
    if (!hasInterviewStarted) return 'text-yellow-300';
    return 'text-gray-300';
  };

  const getCircleMessage = () => {
    if (!isConnected) return 'Conecta el agente para comenzar';
    if (!hasInterviewStarted) return 'Presiona "Iniciar Entrevista"';
    return 'La entrevista ha terminado';
  };

  const getEmptyMessage = () => {
    if (!isConnected) return "Conecta el agente para comenzar la entrevista";
    if (!hasInterviewStarted) return "¡Hola! Soy María de TalentConnect. Gracias por tu tiempo. Tenemos 90 segundos para conocerte mejor. ¿Estás listo para comenzar la entrevista?";
    if (isInterviewFinished) return "La entrevista ha terminado. ¡Gracias por tu tiempo!";
    return "¡Hola! Soy María de TalentConnect. Gracias por tu tiempo. Tenemos 90 segundos para conocerte mejor. ¿Estás listo para comenzar la entrevista?";
  };

  const getInputPlaceholder = () => {
    if (!isConnected) return "Conecta el agente para comenzar...";
    if (!hasInterviewStarted) return "Inicia la entrevista para responder...";
    if (isInterviewFinished) return "La entrevista ha terminado";
    return "Responde las preguntas de la entrevista...";
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
        {timerActive && isConnected && hasInterviewStarted && !isInterviewFinished ? (
          <InterviewTimer
            timeRemaining={timeRemaining}
            maxTime={90}
            isActive={isSpeaking || isListening}
            className="mx-auto"
          />
        ) : (
          <div className="text-center py-8">
            <div className={`w-24 h-24 rounded-full border-4 mx-auto flex items-center justify-center ${getCircleStyles()}`}>
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
        title="Información de la Entrevista (VAPI)"
        description="María es una entrevistadora experta de TalentConnect México con más de 8 años de experiencia. Esta entrevista express de 90 segundos evalúa tus competencias clave a través de 3 preguntas estructuradas: experiencia relevante, manejo de desafíos y motivación para el puesto. Utiliza la tecnología de VAPI con voz de Cartesia."
        additionalInfo={[
          'Duración: 90 segundos máximo',
          'Formato: Entrevista estructurada',
          'Evaluación: Competencias clave',
          'Estilo: Directo y eficiente',
          'Tecnología: VAPI + Cartesia',
          'Objetivo: Evaluación rápida de candidatos'
        ]}
      />

      {/* Instrucciones para el candidato */}
      <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-2">Instrucciones para el Candidato</h4>
        <div className="text-xs text-blue-200 space-y-1">
          <p>• Mantén tus respuestas concisas y específicas</p>
          <p>• Proporciona ejemplos concretos cuando sea posible</p>
          <p>• La entrevistadora puede interrumpirte cortésmente para mantener el tiempo</p>
          <p>• Al final tendrás oportunidad de hacer una pregunta rápida</p>
          <p>• El tiempo total es de 90 segundos máximo</p>
          <p>• Utiliza el micrófono para responder verbalmente</p>
        </div>
      </div>

      {/* Información técnica de VAPI */}
      <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-300 mb-2">Información Técnica VAPI</h4>
        <div className="text-xs text-green-200 space-y-1">
          <p>• Proveedor de voz: Cartesia</p>
          <p>• ID de voz: 846d6cb0-2301-48b6-9683-48f5618ea2f6</p>
          <p>• Modelo: GPT-4o</p>
          <p>• Transcripción: Deepgram Nova-2</p>
          <p>• Estado de llamada: {callStatus || 'No disponible'}</p>
        </div>
      </div>
    </div>
  );
};

export default VapiEntrevistador;
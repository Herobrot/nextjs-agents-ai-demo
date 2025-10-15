import { useState, useEffect, useCallback, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { elevenLabsConfig, ExtendedUseCaseKey } from '../config/elevenlabs';
import { getPromptForUseCase } from '../utils/promptLoader';
import { 
  UseElevenLabsReturn, 
  isEntrevistadorConfig,
  hasConversationFlow 
} from '../types/elevenlabs.types';

export const useElevenLabsAgent = (
  useCase: ExtendedUseCaseKey,
  onInterviewComplete?: (reason: 'completed' | 'time_up' | 'candidate_request', message?: string) => void
): UseElevenLabsReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [conversationTime, setConversationTime] = useState(0);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [isAgentEndingInterview, setIsAgentEndingInterview] = useState(false);
  
  // Referencias para controlar el temporizador de interrupción por pregunta
  const questionStartTimeRef = useRef<number | null>(null);
  const hasInterruptedCurrentQuestionRef = useRef(false);
  const interruptionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Nueva: Acumulador de transcripción en tiempo real
  const currentTranscriptRef = useRef<string>('');
  const isCapturingTranscriptRef = useRef(false);

  const config = useCase === 'atencion-cliente-computadoras' 
    ? elevenLabsConfig.useCases['atencion-cliente'] 
    : elevenLabsConfig.useCases[useCase];
  
  const initialPrompt = useCase === 'atencion-cliente-computadoras' 
    ? getPromptForUseCase('atencion-cliente-computadoras')
    : config.initialPrompt;

  const firstMessage = useCase === 'atencion-cliente-computadoras' 
    ? '¡Hola! Soy tu asistente especializado en soporte técnico de computadoras. ¿En qué puedo ayudarte con tu equipo?'
    : config.firstMessage;

  const conversationFlowConfig = hasConversationFlow(config.agentConfig) 
    ? config.agentConfig.conversationFlow 
    : undefined;
  const isEntrevistador = useCase === 'entrevistador';
  
  // Configuración del tiempo de interrupción (30 segundos por defecto)
  const QUESTION_TIME_LIMIT = 30;
  
  const {
    startSession,
    endSession,
    isSpeaking: elevenLabsSpeaking,
    micMuted,
    sendUserMessage
  } = useConversation({
    agentId: elevenLabsConfig.agentId,
    overrides: {
      agent: {
        prompt: {
          prompt: initialPrompt
        },
        firstMessage: firstMessage,
        ...(isEntrevistador && isEntrevistadorConfig(config.agentConfig) && {
          language: config.agentConfig.language
        })
      },
      ...(isEntrevistador && isEntrevistadorConfig(config.agentConfig) && {
        tts: {
          voiceId: config.agentConfig.voiceId
        }
      })
    },
    voiceSettings: config.agentConfig.voiceSettings,
    ...(isEntrevistador && conversationFlowConfig?.enabled && {
      conversationFlow: {
        interruptionThreshold: conversationFlowConfig.interruptionThreshold,
        maxResponseTime: conversationFlowConfig.maxResponseTime,
        silenceTimeout: conversationFlowConfig.silenceTimeout,
        enableInterruptions: conversationFlowConfig.enableInterruptions,
        responseDelay: conversationFlowConfig.responseDelay
      }
    }),
    ...(isEntrevistador && isEntrevistadorConfig(config.agentConfig) && config.agentConfig.tools && {
      tools: config.agentConfig.tools
    }),
    onConnect: () => {
      setIsConnected(true);
      setError(null);
      setIsConnecting(false);
      if (isEntrevistador) {
        setConversationTime(0);
        setTimeRemaining(conversationFlowConfig?.maxConversationDuration || 90);
        setIsInterrupted(false);
        setIsAgentEndingInterview(false);
        questionStartTimeRef.current = Date.now();
        hasInterruptedCurrentQuestionRef.current = false;
        currentTranscriptRef.current = '';
        isCapturingTranscriptRef.current = false;
      }
    },
    onDisconnect: () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setIsConnecting(false);
      if (isEntrevistador) {
        setConversationTime(0);
        setTimeRemaining(conversationFlowConfig?.maxConversationDuration || 90);
        setIsInterrupted(false);
        setIsAgentEndingInterview(false);
        questionStartTimeRef.current = null;
        hasInterruptedCurrentQuestionRef.current = false;
        currentTranscriptRef.current = '';
        isCapturingTranscriptRef.current = false;
        if (interruptionTimerRef.current) {
          clearTimeout(interruptionTimerRef.current);
          interruptionTimerRef.current = null;
        }
      }
    },
    onError: (message: string) => {
      setError(message || 'Error desconocido');
      setIsConnecting(false);
    },
    onModeChange: ({ mode }: { mode: string }) => {
      if (mode === 'speaking') {
        setIsSpeaking(true);
        setIsListening(false);
        
        // Cuando el agente empieza a hablar (nueva pregunta), reiniciar el temporizador
        if (isEntrevistador && isConnected) {
          questionStartTimeRef.current = Date.now();
          hasInterruptedCurrentQuestionRef.current = false;
          currentTranscriptRef.current = '';
          isCapturingTranscriptRef.current = false;
          
          // Limpiar temporizador anterior si existe
          if (interruptionTimerRef.current) {
            clearTimeout(interruptionTimerRef.current);
            interruptionTimerRef.current = null;
          }
        }
      } else if (mode === 'listening') {
        setIsListening(true);
        setIsSpeaking(false);
        
        // Cuando empieza a escuchar, iniciar captura de transcripción y programar la interrupción
        if (isEntrevistador && isConnected && !hasInterruptedCurrentQuestionRef.current) {
          isCapturingTranscriptRef.current = true;
          currentTranscriptRef.current = '';
          
          interruptionTimerRef.current = setTimeout(() => {
            // Enviar mensaje de interrupción al agente con la transcripción capturada
            if (!hasInterruptedCurrentQuestionRef.current) {
              hasInterruptedCurrentQuestionRef.current = true;
              isCapturingTranscriptRef.current = false;
              
              const transcript = currentTranscriptRef.current.trim();
              let interruptionMessage: string;
              
              if (transcript) {
                interruptionMessage = 
                  `[TRANSCRIPCIÓN DEL CANDIDATO]: "${transcript}"\n\n` +
                  `Han pasado 30 segundos. Por favor, considera brevemente lo que el candidato ha mencionado, ` +
                  `interrumpe amablemente y prosigue con la siguiente pregunta.`;
              } else {
                interruptionMessage = 
                  `Han pasado 30 segundos y el candidato no ha respondido o su respuesta no fue clara. ` +
                  `Por favor, interrumpe amablemente y prosigue con la siguiente pregunta.`;
              }
              
              sendUserMessage(interruptionMessage);
              setIsInterrupted(true);
              setTimeout(() => setIsInterrupted(false), 2000);
              
              // Limpiar la transcripción
              currentTranscriptRef.current = '';
            }
          }, QUESTION_TIME_LIMIT * 1000);
        }
      } else {
        setIsSpeaking(false);
        setIsListening(false);
      }
    },
    // NUEVO: Callback para capturar la transcripción en tiempo real
    onMessage: (message: any) => {
      // ElevenLabs envía mensajes con el tipo 'user_transcript' durante la conversación
      console.log('Mensaje recibido: ', message);      
    },
    ...(isEntrevistador && conversationFlowConfig?.enabled && {
      onInterruption: () => {
        setIsInterrupted(true);
        setTimeout(() => setIsInterrupted(false), 1000);
      }
    }),
    ...(isEntrevistador && {
      onToolCall: (toolCall: any) => {
        if (toolCall.name === 'end_interview') {
          const reason = toolCall.parameters?.reason || 'completed';
          const message = toolCall.parameters?.message;
          
          setIsAgentEndingInterview(true);
          onInterviewComplete?.(reason, message);
          
          // Limpiar temporizador de interrupción y transcripción
          isCapturingTranscriptRef.current = false;
          currentTranscriptRef.current = '';
          if (interruptionTimerRef.current) {
            clearTimeout(interruptionTimerRef.current);
            interruptionTimerRef.current = null;
          }
          
          if (conversationFlowConfig?.autoEndAfterCompletion) {
            const delay = conversationFlowConfig.completionDelay || 3;
            setTimeout(() => {
              endSession();
            }, delay * 1000);
          }
        }
      }
    }),
    onStatusChange: ({ status: newStatus }: { status: string }) => {
      if (newStatus === 'connecting') {
        setIsConnecting(true);
      } else if (newStatus === 'connected') {
        setIsConnected(true);
        setIsConnecting(false);
      } else if (newStatus === 'disconnected') {
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setIsListening(false);
      }
    }
  });

  // Timer para control de tiempo total de conversación
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected && isEntrevistador && conversationFlowConfig?.enabled) {
      interval = setInterval(() => {
        setConversationTime(prev => {
          const newTime = prev + 1;
          const remaining = (conversationFlowConfig.maxConversationDuration || 90) - newTime;
          console.log(`Tiempo restante de entrevista: ${remaining} segundos`);
          setTimeRemaining(Math.max(0, remaining));
          
          if (remaining <= 0 && !isAgentEndingInterview) {
            onInterviewComplete?.('time_up', 'Tiempo de entrevista completado');
            
            // Limpiar temporizador de interrupción y transcripción
            isCapturingTranscriptRef.current = false;
            currentTranscriptRef.current = '';
            if (interruptionTimerRef.current) {
              clearTimeout(interruptionTimerRef.current);
              interruptionTimerRef.current = null;
            }
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected, isEntrevistador, conversationFlowConfig, endSession, isAgentEndingInterview, onInterviewComplete]);

  // Limpiar temporizadores al desmontar
  useEffect(() => {
    return () => {
      if (interruptionTimerRef.current) {
        clearTimeout(interruptionTimerRef.current);
      }
      isCapturingTranscriptRef.current = false;
      currentTranscriptRef.current = '';
    };
  }, []);

  const connect = useCallback(async () => {
    if (!elevenLabsConfig.agentId) {
      setError('Agent ID no configurado. Por favor, configura el agentId en el archivo de configuración.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      await startSession({
        agentId: elevenLabsConfig.agentId,
        connectionType: 'websocket'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar');
      setIsConnecting(false);
    }
  }, [startSession]);

  const disconnect = useCallback(async () => {
    try {
      // Limpiar temporizador de interrupción y transcripción
      isCapturingTranscriptRef.current = false;
      currentTranscriptRef.current = '';
      if (interruptionTimerRef.current) {
        clearTimeout(interruptionTimerRef.current);
        interruptionTimerRef.current = null;
      }
      
      await endSession();
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setIsConnecting(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desconectar');
    }
  }, [endSession]);

  const startConversation = useCallback(() => {
    if (!isConnected) {
      setError('No hay conexión activa');
    }
  }, [isConnected]);

  const stopConversation = useCallback(() => {
    if (isConnected) {
      // Limpiar temporizador de interrupción y transcripción
      isCapturingTranscriptRef.current = false;
      currentTranscriptRef.current = '';
      if (interruptionTimerRef.current) {
        clearTimeout(interruptionTimerRef.current);
        interruptionTimerRef.current = null;
      }
      endSession();
    }
  }, [isConnected, endSession]);

  const sendMessage = useCallback((message: string) => {
    if (!isConnected) {
      setError('No hay conexión activa');
      return;
    }
    sendUserMessage(message);
  }, [isConnected, sendUserMessage]);

  const toggleMute = useCallback(() => {
    setIsMuted(!micMuted);
  }, [micMuted]);

  useEffect(() => {
    setIsSpeaking(elevenLabsSpeaking);
    setIsMuted(micMuted || false);
  }, [elevenLabsSpeaking, micMuted]);

  return {
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
    isInterrupted,
    timeRemaining,
    onInterviewComplete
  };
};
import { useState, useEffect, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import { vapiConfig, VapiUseCaseKey } from "../config/vapi";
import { UseVapiReturn } from "@/types/vapi.types";

export const useVapiAgent = (useCase: VapiUseCaseKey): UseVapiReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<string | null>(null);
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [userTranscript, setUserTranscript] = useState<string>("");
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  const config = vapiConfig.useCases[useCase];

  // Validar configuración del caso de uso
  useEffect(() => {
    if (!config) {
      setError(
        `Caso de uso '${useCase}' no encontrado en la configuración. Casos disponibles: ${Object.keys(vapiConfig.useCases).join(", ")}`,
      );
      return;
    }

    if (!config.agentConfig?.assistantId) {
      setError(`Assistant ID no configurado para el caso de uso '${useCase}'`);
      return;
    }

    console.log(`Configuración cargada para caso de uso: ${useCase}`, {
      name: config.name,
      assistantId: config.agentConfig.assistantId,
      voiceProvider: config.agentConfig.voice?.provider,
      modelProvider: config.agentConfig.model?.provider,
    });
  }, [useCase, config]);

  // Inicializar VAPI - basado en el ejemplo oficial
  useEffect(() => {
    console.log("VAPI Config API Key:", vapiConfig.apiKey);
    console.log("Environment VAPI_API_KEY:", process.env.VAPI_API_KEY);

    if (!vapiConfig.apiKey) {
      setError(
        "API Key de VAPI no configurada. Por favor, configura la API key en el archivo de configuración.",
      );
      return;
    }

    console.log("Creating VAPI instance with key:", vapiConfig.apiKey);
    const vapiInstance = new Vapi(vapiConfig.apiKey);
    setVapi(vapiInstance);

    // Event listeners basados en el ejemplo oficial
    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      setCallStatus("active");
    });

    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setIsConnecting(false);
      setCallStatus("ended");
      setCallId(null);
    });

    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setIsSpeaking(true);
      setIsListening(false);
    });

    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setIsSpeaking(false);
    });

    vapiInstance.on("message", (message: any) => {
      console.log("Vapi message:", message);

      if (message.type === "transcript") {
        console.log("Transcript received:", {
          role: message.role,
          type: message.transcriptType,
          content: message.transcript,
        });

        // Capturar transcripciones del USUARIO
        if (message.role === "user") {
          if (message.transcriptType === "partial") {
            // Transcripción parcial - se actualiza mientras el usuario habla
            setUserTranscript(message.transcript);
            setIsUserSpeaking(true);
          } else if (message.transcriptType === "final") {
            // Transcripción final - cuando el usuario termina de hablar
            setUserTranscript(message.transcript);
            setIsUserSpeaking(false);
            console.log("Final user transcript:", message.transcript);
          }
        }

        // Capturar transcripciones del ASISTENTE
        if (message.role === "assistant") {
          console.log("Assistant transcript:", message.transcript);
        }
      }
    });

    // Eventos de detección de voz del usuario
    vapiInstance.on("volume-level", (volume: number) => {
      // Usar el nivel de volumen para detectar si el usuario está hablando
      if (volume > 0.1) {
        setIsListening(true);
      } else {
        setIsListening(false);
      }
    });

    vapiInstance.on("error", (error: any) => {
      console.error("Vapi error:", error);
      setError(error.message || "Error desconocido");
      setIsConnecting(false);
      setIsConnected(false);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const clearUserTranscript = useCallback(() => {
    setUserTranscript("");
    setIsUserSpeaking(false);
  }, []);

  const connect = useCallback(async () => {
    if (!vapiConfig.apiKey) {
      setError(
        "API Key de VAPI no configurada. Por favor, configura la API key en el archivo de configuración.",
      );
      return;
    }

    if (!vapi) {
      setError("VAPI no está inicializado");
      return;
    }

    if (!config) {
      setError(`Configuración no encontrada para el caso de uso '${useCase}'`);
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Validar que los campos esenciales estén presentes
      if (
        !config.agentConfig.model?.provider ||
        !config.agentConfig.model?.model
      ) {
        throw new Error("Configuración del modelo incompleta");
      }
      if (
        !config.agentConfig.voice?.provider ||
        !config.agentConfig.voice?.voiceId
      ) {
        throw new Error("Configuración de voz incompleta");
      }
      if (
        !config.agentConfig.transcriber?.provider ||
        !config.agentConfig.transcriber?.model
      ) {
        throw new Error("Configuración del transcriptor incompleta");
      }

      // Crear configuración básica compatible con la API de Vapi
      const vapiStartConfig: any = {
        // Configuración del modelo - formato simplificado
        model: {
          provider: config.agentConfig.model.provider,
          model: config.agentConfig.model.model,
          messages: config.agentConfig.model.messages,
        },

        // Configuración de voz - solo campos esenciales
        voice: {
          provider: config.agentConfig.voice.provider,
          voiceId: config.agentConfig.voice.voiceId,
        },

        // Configuración del transcriptor - solo campos esenciales
        transcriber: {
          provider: config.agentConfig.transcriber.provider,
          model: config.agentConfig.transcriber.model,
          language: config.agentConfig.transcriber.language,
        },

        // Mensajes esenciales
        firstMessage: config.agentConfig.firstMessage,
        endCallMessage: config.agentConfig.endCallMessage,

        // Configuraciones básicas de tiempo
        maxDurationSeconds: config.agentConfig.maxDurationSeconds || 600,
      };

      // Agregar campos adicionales de voz solo si existen
      if ("model" in config.agentConfig.voice) {
        vapiStartConfig.voice.model = config.agentConfig.voice.model;
      }
      if ("experimentalControls" in config.agentConfig.voice) {
        vapiStartConfig.voice.experimentalControls =
          config.agentConfig.voice.experimentalControls;
      }
      if ("speed" in config.agentConfig.voice) {
        vapiStartConfig.voice.speed = config.agentConfig.voice.speed;
      }
      if ("pitch" in config.agentConfig.voice) {
        vapiStartConfig.voice.pitch = config.agentConfig.voice.pitch;
      }

      // Agregar configuraciones opcionales solo si están definidas
      if (config.agentConfig.voicemailMessage) {
        vapiStartConfig.voicemailMessage = config.agentConfig.voicemailMessage;
      }
      if (
        config.agentConfig.endCallPhrases &&
        config.agentConfig.endCallPhrases.length > 0
      ) {
        vapiStartConfig.endCallPhrases = config.agentConfig.endCallPhrases;
      }
      if (config.agentConfig.silenceTimeoutSeconds) {
        vapiStartConfig.silenceTimeoutSeconds =
          config.agentConfig.silenceTimeoutSeconds;
      }
      if (config.agentConfig.responseDelaySeconds) {
        vapiStartConfig.responseDelaySeconds =
          config.agentConfig.responseDelaySeconds;
      }
      if (config.agentConfig.interruptionThreshold) {
        vapiStartConfig.interruptionThreshold =
          config.agentConfig.interruptionThreshold;
      }

      console.log(
        `Starting call with custom configuration for use case: ${useCase}`,
        vapiStartConfig,
      );

      // Log de debugging detallado
      console.log("VapiStartConfig details:", {
        model: vapiStartConfig.model,
        voice: vapiStartConfig.voice,
        transcriber: vapiStartConfig.transcriber,
        firstMessage: vapiStartConfig.firstMessage,
        maxDurationSeconds: vapiStartConfig.maxDurationSeconds,
      });

      await vapi.start({
        // Basic assistant configuration
        model: {
          provider: config.agentConfig.model.provider,
          model: config.agentConfig.model.model,
          messages: [
            {
              role: "system",
              content: config.initialPrompt,
            },
          ],
        },

        // Voice configuration
        voice: {
          provider: config.agentConfig.voice.provider,
          voiceId: config.agentConfig.voice.voiceId,
        },

        // Transcriber configuration
        transcriber: {
          provider: config.agentConfig.transcriber.provider,
          model: config.agentConfig.transcriber.model,
          language: config.agentConfig.transcriber.language,
        },

        // Call settings
        firstMessage: config.agentConfig.firstMessage,
        endCallMessage: config.agentConfig.endCallMessage,
        endCallPhrases: config.agentConfig.endCallPhrases,

        // Max call duration (in seconds) - 10 minutes
        maxDurationSeconds: 600,
      });
    } catch (err) {
      console.error("Error starting call with custom config:", err);

      // Log detallado del error para debugging
      if (err && typeof err === "object") {
        console.error("Error details:", {
          type: (err as any).type,
          stage: (err as any).stage,
          error: (err as any).error,
          context: (err as any).context,
        });

        // Intentar extraer el mensaje de error específico
        if ((err as any).error?.error) {
          console.error("API Error:", (err as any).error.error);
        }
      }

      // Intentar con assistantId como fallback si la configuración personalizada falla
      const assistantId = config.agentConfig.assistantId;
      if (assistantId) {
        try {
          console.log("Trying fallback with assistantId:", assistantId);
          await vapi.start(assistantId);
          console.log("Fallback successful - using preconfigured assistant");
          return; // Salir si el fallback funciona
        } catch (fallbackErr) {
          console.error("Fallback also failed:", fallbackErr);
        }
      }

      setError(err instanceof Error ? err.message : "Error al conectar");
      setIsConnecting(false);
    }
  }, [vapi, config, useCase]);

  const disconnect = useCallback(async () => {
    if (!vapi) {
      return;
    }

    try {
      console.log("Ending call");
      vapi.stop();
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setIsConnecting(false);
      setError(null);
      setCallId(null);
      setCallStatus(null);
    } catch (err) {
      console.error("Error ending call:", err);
      setError(err instanceof Error ? err.message : "Error al desconectar");
    }
  }, [vapi]);

  const startConversation = useCallback(() => {
    if (!isConnected) {
      setError("No hay conexión activa");
    }
  }, [isConnected]);

  const stopConversation = useCallback(() => {
    if (isConnected && vapi) {
      vapi.stop();
    }
  }, [isConnected, vapi]);

  const sendMessage = useCallback(
    (message: string) => {
      if (!isConnected || !vapi) {
        setError("No hay conexión activa");
        return;
      }

      // En VAPI, los mensajes se envían a través del micrófono
      // Este método se mantiene para compatibilidad pero no tiene efecto directo
      console.log("Mensaje enviado:", message);
    },
    [isConnected, vapi],
  );

  const toggleMute = useCallback(() => {
    if (!vapi) {
      return;
    }

    try {
      if (isMuted) {
        // vapi.unmute(); // Método no disponible en la versión actual
        setIsMuted(false);
      } else {
        // vapi.mute(); // Método no disponible en la versión actual
        setIsMuted(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cambiar mute");
    }
  }, [vapi, isMuted]);

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
    callId,
    callStatus,
    userTranscript,
    isUserSpeaking,
    clearUserTranscript,
  };
};

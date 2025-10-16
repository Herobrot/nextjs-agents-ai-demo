import { getVapiPromptForUseCase } from "../utils/promptLoader";

export const vapiConfig = {
  apiKey: "a2677689-e7cf-411e-b164-b52b42f2ca1f",
  useCases: {
    "atencion-cliente": {
      name: "Atención al Cliente",
      description: "Asistente de voz para atención al cliente",
      initialPrompt: getVapiPromptForUseCase("atencion-cliente"),

      agentConfig: {
        assistantId: "d20d5162-d1ae-46b5-be58-fe4dae294a10" as const,

        voice: {
          provider: "cartesia" as const,
          voiceId: "34dbb662-8e98-413c-a1ef-1a3407675fe7" as const,
          speed: 1.0,
          pitch: 1.0,
        },

        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          messages: [
            {
              role: "system",
              content: getVapiPromptForUseCase("atencion-cliente"),
            },
          ],
        },

        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "es" as const,
        },

        firstMessage:
          "Hola, soy tu asistente de atención al cliente. ¿En qué puedo ayudarte hoy?",
        voicemailMessage: "Por favor, llama de nuevo cuando estés disponible.",
        endCallMessage:
          "Gracias por contactarnos. ¡Que tengas un excelente día!",
        endCallPhrases: ["adiós", "hasta luego", "gracias", "chao"],
        silenceTimeoutSeconds: 30,
        responseDelaySeconds: 0.4,
        interruptionThreshold: 0.5,
        maxDurationSeconds: 300,

        serverUrl: "",
        serverUrlSecret: "",
        isServerUrlSecretSet: false,
      },
    },
    "asistente-virtual": {
      name: "Asistente Virtual",
      description: "Asistente virtual general con capacidades conversacionales",
      initialPrompt: getVapiPromptForUseCase("asistente-virtual"),

      agentConfig: {
        voice: {
          provider: "cartesia" as const,
          voiceId: "34dbb662-8e98-413c-a1ef-1a3407675fe7" as const,
          speed: 1.1,
          pitch: 1.0,
        },

        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          messages: [
            {
              role: "system",
              content: getVapiPromptForUseCase("asistente-virtual"),
            },
          ],
        },

        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "es" as const,
        },

        firstMessage:
          "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
        voicemailMessage: "Por favor, llama de nuevo cuando estés disponible.",
        endCallMessage: "¡Fue un placer ayudarte! ¡Hasta la próxima!",
        endCallPhrases: [
          "adiós",
          "hasta luego",
          "gracias",
          "chao",
          "nos vemos",
        ],
        silenceTimeoutSeconds: 45,
        responseDelaySeconds: 0.3,
        interruptionThreshold: 0.6,
        maxDurationSeconds: 600,

        assistantId: "d20d5162-d1ae-46b5-be58-fe4dae294a10" as const,
        serverUrl: "",
        serverUrlSecret: "",
        isServerUrlSecretSet: false,
      },
    },
    "narracion-contenidos": {
      name: "Narración de Contenidos",
      description: "Narrador de voz para contenido multimedia",
      initialPrompt: getVapiPromptForUseCase("narracion-contenidos"),

      agentConfig: {
        voice: {
          provider: "cartesia" as const,
          voiceId: "34dbb662-8e98-413c-a1ef-1a3407675fe7dvUeBnXmlld" as const,
          speed: 0.9,
          pitch: 0.9,
        },

        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          messages: [
            {
              role: "system",
              content: getVapiPromptForUseCase("narracion-contenidos"),
            },
          ],
        },

        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "es" as const,
        },

        firstMessage:
          "Bienvenido. Soy tu narrador profesional. ¿Qué contenido te gustaría que narre?",
        voicemailMessage: "Por favor, llama de nuevo cuando estés disponible.",
        endCallMessage: "Ha sido un placer narrar para ti. ¡Hasta la próxima!",
        endCallPhrases: ["fin", "terminar", "gracias", "adiós"],
        silenceTimeoutSeconds: 60,
        responseDelaySeconds: 0.5,
        interruptionThreshold: 0.4,
        maxDurationSeconds: 1800,

        assistantId: "d20d5162-d1ae-46b5-be58-fe4dae294a10" as const,
        serverUrl: "",
        serverUrlSecret: "",
        isServerUrlSecretSet: false,
      },
    },
    "atencion-cliente-computadoras": {
      name: "Atención al Cliente - Computadoras",
      description: "Especialista en hardware de PC (José de TecnoNeuro)",
      initialPrompt: getVapiPromptForUseCase("atencion-cliente-computadoras"),

      agentConfig: {
        voice: {
          provider: "cartesia" as const,
          voiceId: "34dbb662-8e98-413c-a1ef-1a3407675fe7" as const,
          speed: 0.95,
          pitch: 1.0,
        },

        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          messages: [
            {
              role: "system",
              content: getVapiPromptForUseCase("atencion-cliente-computadoras"),
            },
          ],
        },

        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "es" as const,
        },

        firstMessage:
          "Hola, soy José de TecnoNeuro. ¿En qué puedo ayudarte con tu PC hoy?",
        voicemailMessage: "Por favor, llama de nuevo cuando estés disponible.",
        endCallMessage:
          "Gracias por contactar TecnoNeuro. ¡Esperamos ayudarte con tu próximo proyecto!",
        endCallPhrases: ["adiós", "hasta luego", "gracias", "chao"],
        silenceTimeoutSeconds: 40,
        responseDelaySeconds: 0.4,
        interruptionThreshold: 0.5,
        maxDurationSeconds: 600,

        assistantId: "d20d5162-d1ae-46b5-be58-fe4dae294a10" as const,
        serverUrl: "",
        serverUrlSecret: "",
        isServerUrlSecretSet: false,
      },
    },
    entrevistador: {
      name: "Entrevistador de Trabajo",
      description:
        "Entrevistadora de RRHH con control de tiempo estricto (90 segundos)",
      initialPrompt: getVapiPromptForUseCase("entrevistador"),

      agentConfig: {
        assistantId: "d20d5162-d1ae-46b5-be58-fe4dae294a10" as const,

        voice: {
          provider: "cartesia" as const,
          voiceId: "846d6cb0-2301-48b6-9683-48f5618ea2f6" as const,
          model: "sonic-2" as const,
          experimentalControls: {
            speed: "normal" as const,
          },
        },

        model: {
          provider: "openai" as const,
          model: "gpt-4o" as const,
          messages: [
            {
              role: "system",
              content: getVapiPromptForUseCase("entrevistador"),
            },
          ],
        },

        transcriber: {
          provider: "deepgram" as const,
          model: "nova-2" as const,
          language: "es" as const,
        },

        firstMessage:
          "Hola, soy María de TalentConnect. Gracias por tu tiempo. Tenemos 90 segundos para conocerte mejor. Empecemos: ¿Cuál ha sido tu logro profesional más importante y por qué?",
        voicemailMessage: "Por favor, llama de nuevo cuando estés disponible.",
        endCallMessage: "Hasta luego.",
        endCallPhrases: [
          "finalizar entrevista completamente",
          "terminar llamada ahora",
          "despedida final total"
        ],
        silenceTimeoutSeconds: 15,
        responseDelaySeconds: 0.2,
        interruptionThreshold: 0.3,
        maxDurationSeconds: 130,

        serverUrl: "",
        serverUrlSecret: "",
        isServerUrlSecretSet: false,
      },
    },
  },
};

export type VapiUseCaseKey = keyof typeof vapiConfig.useCases;
export type VapiUseCaseConfigType =
  (typeof vapiConfig.useCases)[VapiUseCaseKey];

export const vapiGlobalConfig = {
  webhookUrl: "",

  enableMetrics: true,

  enableLogging: true,

  enableSecurity: true,

  maxConcurrentCalls: 10,
  maxCallDuration: 1800,
  maxSilenceDuration: 60,
};

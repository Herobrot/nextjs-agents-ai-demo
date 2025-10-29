// src/config/elevenlabs.ts
import { getPromptForUseCase } from "../utils/promptLoader";
import { 
  ElevenLabsConfig, 
  EntrevistadorAgentConfig,
  UseCaseConfig 
} from "../types/elevenlabs.types";

export const elevenLabsConfig: ElevenLabsConfig = {
  agentId: "agent_6201k56a74d5f6nvas289hqm12v5",
  useCases: {
    "atencion-cliente": {
      name: "Atención al Cliente",
      description: "Asistente de voz para atención al cliente",
      initialPrompt: getPromptForUseCase("atencion-cliente"),
      firstMessage:
        "¡Hola! Soy tu asistente de atención al cliente. ¿En qué puedo ayudarte hoy?",
      agentConfig: {
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
          style: 0,
          useSpeakerBoost: true,
        },
      },
    },
    "asistente-virtual": {
      name: "Asistente Virtual",
      description: "Asistente virtual general con capacidades conversacionales",
      initialPrompt: getPromptForUseCase("asistente-virtual"),
      firstMessage:
        "¡Hola! Soy tu asistente virtual personal. Estoy aquí para ayudarte con cualquier consulta que tengas. ¿Cómo puedo asistirte?",
      agentConfig: {
        voiceSettings: {
          stability: 0.7,
          similarityBoost: 0.6,
          style: 0.2,
          useSpeakerBoost: true,
        },
      },
    },
    "narracion-contenidos": {
      name: "Narración de Contenidos",
      description: "Narrador de voz para contenido multimedia",
      initialPrompt: getPromptForUseCase("narracion-contenidos"),
      firstMessage:
        "Bienvenido. Soy tu narrador de contenidos. Estoy listo para comenzar la narración cuando me indiques.",
      agentConfig: {
        voiceSettings: {
          stability: 0.8,
          similarityBoost: 0.7,
          style: 0.3,
          useSpeakerBoost: false,
        },
      },
    },
    "entrevistador": {
      name: "Entrevistador de Trabajo",
      description: "Entrevistadora de RRHH con control de tiempo estricto",
      initialPrompt: getPromptForUseCase("entrevistador"),
      firstMessage:
        "Hola, soy María de TalentConnect. Gracias por tu tiempo. Tenemos 90 segundos para conocerte mejor. Empecemos: ¿Cuál ha sido tu logro profesional más importante y por qué?",
      agentConfig: {
        voiceSettings: {
          stability: 0.6,
          similarityBoost: 0.8,
          style: 0.1,
          useSpeakerBoost: true,
        },
        voiceId: "m7yTemJqdIqrcNleANfX",
        language: "es",
        conversationFlow: {
          enabled: true,
          interruptionThreshold: 0.3,
          maxResponseTime: 30,
          silenceTimeout: 15,
          maxConversationDuration: 90,
          enableInterruptions: true,
          responseDelay: 0.2,
          autoEndAfterCompletion: true,
          completionDelay: 3,
        },
        tools: [
          {
            name: "end_interview",
            description:
              "Finaliza la entrevista y cierra la llamada automáticamente",
            parameters: {
              reason: "completed",
              message: "string (opcional)",
            },
          },
        ],
      } as EntrevistadorAgentConfig,
    },
    "entrevistador-alimentos": {
      name: "Santiago Morales - Representante Comercial",
      description: "Agente especializado en presentaciones comerciales de productos alimenticios a compradores de cadenas retail",
      initialPrompt: getPromptForUseCase("entrevistador-alimentos"),
      firstMessage: "¡Hola! Soy Santiago Morales, mucho gusto. Agradezco mucho que me hayas dado este espacio para presentarte nuestro producto. ¿Cómo estás el día de hoy?",
      agentConfig: {
        voiceSettings: {
          stability: 0.7,
          similarityBoost: 0.75,
          style: 0.35,
          useSpeakerBoost: true,
        },
        voiceId: "LnGOA2SxH2fX1e1iNzEp",
        language: "es",
      } as EntrevistadorAgentConfig,
    },
    "atencion-cliente-computadoras": {
      name: "Atención al Cliente - Computadoras",
      description: "Asistente especializado en soporte técnico de computadoras",
      initialPrompt: getPromptForUseCase("atencion-cliente-computadoras"),
      firstMessage:
        "¡Hola! Soy tu asistente especializado en soporte técnico de computadoras. ¿En qué puedo ayudarte con tu equipo?",
      agentConfig: {
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.8,
          style: 0,
          useSpeakerBoost: true,
        },
      },
    },
  },
};

// Helper type para obtener las keys de los casos de uso
export type UseCaseKey = keyof typeof elevenLabsConfig.useCases;

// Helper function para obtener configuración de caso de uso
export function getUseCaseConfig(useCase: UseCaseKey): UseCaseConfig {
  const config = elevenLabsConfig.useCases[useCase];
  if (!config) {
    throw new Error(`Configuración no encontrada para el caso de uso: ${useCase}`);
  }
  return config;
}
// src/types/elevenlabs.types.ts
export interface VoiceSettings {
  stability: number;
  similarityBoost: number;
  style: number;
  useSpeakerBoost: boolean;
}

export interface ConversationFlowConfig {
  enabled: boolean;
  interruptionThreshold: number;
  maxResponseTime: number;
  silenceTimeout: number;
  maxConversationDuration: number;
  enableInterruptions: boolean;
  responseDelay: number;
  autoEndAfterCompletion?: boolean;
  completionDelay?: number;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters?: Record<string, any>;
}

export interface InterviewCompletionTool extends AgentTool {
  name: "end_interview";
  description: "Finaliza la entrevista y cierra la llamada";
  parameters: {
    reason: "completed" | "time_up" | "candidate_request";
    message?: string;
  };
}

export interface BaseAgentConfig {
  voiceSettings: VoiceSettings;
}

export interface ExtendedAgentConfig extends BaseAgentConfig {
  voiceId?: string;
  language?: string;
  conversationFlow?: ConversationFlowConfig;
  tools?: AgentTool[];
}

export interface EntrevistadorAgentConfig extends BaseAgentConfig {
  voiceId: string;
  language: string;
  conversationFlow: ConversationFlowConfig;
  tools?: AgentTool[];
}

export type AgentConfig = BaseAgentConfig | ExtendedAgentConfig | EntrevistadorAgentConfig;

export interface UseCaseConfig {
  name: string;
  description: string;
  initialPrompt: string;
  firstMessage: string;
  agentConfig: AgentConfig;
}

// Configuración completa de ElevenLabs
export interface ElevenLabsConfig {
  agentId: string;
  useCases: Record<string, UseCaseConfig>;
}

// Interface para el hook useElevenLabs
export interface UseElevenLabsReturn {
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  startConversation: () => void;
  stopConversation: () => void;
  sendMessage: (message: string) => void;
  toggleMute: () => void;
  isMuted: boolean;
  conversationTime: number;
  isInterrupted: boolean;
  timeRemaining: number;
  onInterviewComplete?: (
    reason: "completed" | "time_up" | "candidate_request",
    message?: string,
  ) => void;
}

// Type guards para verificar tipos específicos
export function isEntrevistadorConfig(
  config: AgentConfig,
): config is EntrevistadorAgentConfig {
  return (
    "voiceId" in config && 
    "language" in config && 
    "conversationFlow" in config &&
    config.conversationFlow !== undefined
  );
}

export function hasConversationFlow(
  config: AgentConfig,
): config is EntrevistadorAgentConfig {
  return "conversationFlow" in config && config.conversationFlow !== undefined;
}

export function hasVoiceId(
  config: AgentConfig,
): config is ExtendedAgentConfig | EntrevistadorAgentConfig {
  return "voiceId" in config && config.voiceId !== undefined;
}

export function hasLanguage(
  config: AgentConfig,
): config is ExtendedAgentConfig | EntrevistadorAgentConfig {
  return "language" in config && config.language !== undefined;
}
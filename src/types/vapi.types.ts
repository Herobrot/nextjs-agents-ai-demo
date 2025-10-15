// Tipos específicos para Vapi API

export type VapiVoiceProvider = 
  | 'openai' 
  | 'cartesia' 
  | 'azure' 
  | 'custom-voice' 
  | '11labs' 
  | 'elevenlabs'  // Alias para 11labs
  | 'hume' 
  | 'lmnt' 
  | 'neuphonic' 
  | 'playht' 
  | 'rime-ai' 
  | 'smallest-ai' 
  | 'tavus' 
  | 'sesame' 
  | 'minimax';

export type VapiTranscriberProvider = 
  | 'deepgram' 
  | 'rev' 
  | 'azure' 
  | 'aws' 
  | 'google' 
  | 'assembly' 
  | 'speechmatics' 
  | 'soniox' 
  | 'gladia' 
  | 'whisper' 
  | 'openai';

export type VapiModelProvider = 
  | 'openai' 
  | 'anthropic' 
  | 'google' 
  | 'azure' 
  | 'groq' 
  | 'deepseek' 
  | 'together' 
  | 'replicate' 
  | 'huggingface' 
  | 'cohere' 
  | 'mistral' 
  | 'perplexity' 
  | 'custom';

// Configuración base de voz
export interface VapiVoiceConfig {
  provider: VapiVoiceProvider;
  voiceId: string;
  speed?: number;
  pitch?: number;
  model?: string;
  experimentalControls?: {
    speed?: string;
    [key: string]: any;
  };
}

// Configuración de transcriber
export interface VapiTranscriberConfig {
  provider: VapiTranscriberProvider;
  model: string;
  language: string;
}

// Configuración del modelo
export interface VapiModelConfig {
  provider: VapiModelProvider;
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

// Configuración del agente
export interface VapiAgentConfig {
  assistantId: string;
  voice: VapiVoiceConfig;
  model: VapiModelConfig;
  transcriber: VapiTranscriberConfig;
  firstMessage: string;
  voicemailMessage?: string;
  endCallMessage: string;
  endCallPhrases: string[];
  silenceTimeoutSeconds: number;
  responseDelaySeconds: number;
  interruptionThreshold: number;
  maxDurationSeconds: number;
  serverUrl?: string;
  serverUrlSecret?: string;
  isServerUrlSecretSet?: boolean;
}

export interface UseVapiReturn {
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
  callId: string | null;
  callStatus: string | null;
}

// Configuración del caso de uso
export interface VapiUseCaseConfig {
  name: string;
  description: string;
  initialPrompt: string;
  agentConfig: VapiAgentConfig;
}

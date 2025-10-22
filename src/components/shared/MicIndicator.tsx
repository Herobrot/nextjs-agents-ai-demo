import React, { useState, useEffect } from 'react';
import { Mic, Clock, CheckCircle } from 'lucide-react';

interface MicIndicatorProps {
  isUserSpeaking: boolean;
  transcript: string;
  speechDuration: number;
  maxDuration?: number;
  warningThreshold?: number;
  className?: string;
}

type IndicatorState = 'idle' | 'speaking' | 'saved';

const MicIndicator: React.FC<MicIndicatorProps> = ({
  isUserSpeaking,
  transcript,
  speechDuration,
  maxDuration = 30,
  warningThreshold = 25,
  className = '',
}) => {
  const [indicatorState, setIndicatorState] = useState<IndicatorState>('idle');

  // Manejar transiciones de estado
  useEffect(() => {
    if (isUserSpeaking) {
      setIndicatorState('speaking');
    } else if (indicatorState === 'speaking' && transcript) {
      // Mostrar estado "guardado" por 2 segundos antes de volver a idle
      setIndicatorState('saved');
      const timer = setTimeout(() => {
        setIndicatorState('idle');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isUserSpeaking, transcript, indicatorState]);

  // No mostrar nada en estado idle sin transcripción
  if (indicatorState === 'idle' && !transcript) {
    return null;
  }

  // Determinar estilos según el estado
  const getContainerStyles = () => {
    switch (indicatorState) {
      case 'speaking':
        return 'bg-blue-900/40 border-2 border-blue-500/60';
      case 'saved':
        return 'bg-green-900/40 border-2 border-green-500/60';
      case 'idle':
        return 'bg-gray-700/40 border-2 border-gray-600/40 opacity-60';
      default:
        return '';
    }
  };

  const getHeaderContent = () => {
    switch (indicatorState) {
      case 'speaking':
        return (
          <>
            <div className="relative">
              <Mic className="w-5 h-5 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            </div>
            <span className="text-blue-300 text-sm font-semibold">
              Estás hablando...
            </span>
          </>
        );
      case 'saved':
        return (
          <>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 text-sm font-semibold">
              Respuesta guardada
            </span>
          </>
        );
      case 'idle':
        return (
          <>
            <Mic className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-semibold">
              Listo para hablar
            </span>
          </>
        );
    }
  };

  const getFooterMessage = () => {
    if (indicatorState === 'speaking') {
      if (speechDuration >= warningThreshold) {
        return (
          <span className="text-yellow-300 animate-pulse flex items-center gap-1">
            ⚠️ El agente interrumpirá pronto para mantener el tiempo
          </span>
        );
      }
      return (
        <span className="text-blue-300/70">
          💡 El agente te interrumpirá cortésmente si hablas por más de {maxDuration} segundos
        </span>
      );
    }

    if (indicatorState === 'saved') {
      return (
        <span className="text-green-300/70">
          ✓ María está procesando tu respuesta
        </span>
      );
    }

    return (
      <span className="text-gray-400/70">
        Esperando que comiences a hablar...
      </span>
    );
  };

  const getTranscriptStyles = () => {
    switch (indicatorState) {
      case 'speaking':
        return 'text-blue-100';
      case 'saved':
        return 'text-green-100';
      default:
        return 'text-gray-100';
    }
  };

  return (
    <div
      className={`rounded-lg p-4 transition-all duration-500 ease-in-out ${getContainerStyles()} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getHeaderContent()}
        </div>

        {indicatorState === 'speaking' && (
          <div className="flex items-center gap-2 text-blue-300 text-sm font-mono">
            <Clock className="w-4 h-4" />
            <span>{speechDuration}s / {maxDuration}s</span>
          </div>
        )}
      </div>

      {/* Transcripción */}
      {transcript && (
        <div className="bg-gray-900/50 rounded p-3 mb-2">
          <p className={`text-sm ${getTranscriptStyles()}`}>
            {transcript}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs">
        {getFooterMessage()}
      </div>
    </div>
  );
};

export default MicIndicator;
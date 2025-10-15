import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, Pause, Play } from "lucide-react";

interface InterviewTimerProps {
  timeRemaining: number;
  maxTime: number;
  isActive: boolean;
  onTimeUp?: () => void;
  className?: string;
}

const InterviewTimer: React.FC<InterviewTimerProps> = ({
  timeRemaining,
  maxTime,
  isActive,
  onTimeUp,
  className = "",
}) => {
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    // Activar advertencia cuando quedan 30 segundos
    setIsWarning(timeRemaining <= 30 && timeRemaining > 10);

    // Activar estado crítico cuando quedan 10 segundos
    setIsCritical(timeRemaining <= 10);

    // Llamar callback cuando se acaba el tiempo
    if (timeRemaining <= 0 && isActive) {
      onTimeUp?.();
    }
  }, [timeRemaining, isActive, onTimeUp]);

  const getProgressPercentage = () => {
    return ((maxTime - timeRemaining) / maxTime) * 100;
  };

  const getTimerColor = () => {
    if (isCritical) return "text-red-500";
    if (isWarning) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = () => {
    if (isCritical) return "bg-red-500";
    if (isWarning) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusMessage = () => {
    if (isCritical) return "¡Tiempo crítico!";
    if (isWarning) return "Tiempo limitado";
    return "Tiempo restante";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Timer circular */}
      <div className="relative w-28 h-28">
        {/* Círculo de fondo */}
        <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={isCritical ? "#ef4444" : isWarning ? "#eab308" : "#22c55e"}
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - getProgressPercentage() / 100)}`}
            className="transition-all duration-500"
            strokeLinecap="round"
          />
        </svg>

        {/* Contenido central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(Math.max(0, timeRemaining))}
            </div>
            <div className="text-xs text-gray-400 flex items-center justify-center space-x-1 mt-1">
              {isActive ? (
                <Play className="w-3 h-3" />
              ) : (
                <Pause className="w-3 h-3" />
              )}
              <span>{isActive ? "Activo" : "Pausado"}</span>
            </div>
          </div>
        </div>

        {/* Indicador de pulso cuando está activo */}
        {isActive && (
          <div
            className={`absolute inset-0 rounded-full animate-ping ${getProgressColor()} opacity-20`}
          ></div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>0:00</span>
          <span className={getTimerColor()}>{getStatusMessage()}</span>
          <span>{formatTime(maxTime)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Mensajes de estado */}
      {isCritical && (
        <div className="text-center">
          <p className="text-red-400 text-sm font-medium animate-pulse flex items-center justify-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>¡Tiempo crítico! Termina tu respuesta</span>
          </p>
        </div>
      )}

      {isWarning && !isCritical && (
        <div className="text-center">
          <p className="text-yellow-400 text-sm flex items-center justify-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Tiempo limitado - Mantén respuestas concisas</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewTimer;

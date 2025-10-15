import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash,
  faSpinner,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

interface MicButtonProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onRequestPermission?: () => Promise<boolean>;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const MicButton: React.FC<MicButtonProps> = ({
  isConnected,
  isSpeaking,
  isListening,
  isMuted,
  onToggleMute,
  onRequestPermission,
  className = "",
  size = "md",
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Verificar permisos al montar el componente
  useEffect(() => {
    checkMicrophonePermission();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      setHasPermission(permission.state === "granted");
    } catch (error) {
      // Fallback para navegadores que no soportan permissions API
      console.warn("Permissions API no soportada:", error);
      setHasPermission(null);
    }
  };

  const requestMicrophonePermission = async () => {
    setIsRequestingPermission(true);
    try {
      // Intentar acceder al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detener el stream inmediatamente ya que solo necesitamos el permiso
      stream.getTracks().forEach((track) => track.stop());

      setHasPermission(true);

      // Llamar callback personalizado si existe
      if (onRequestPermission) {
        await onRequestPermission();
      }

      return true;
    } catch (error) {
      console.error("Error al solicitar permiso del micrófono:", error);
      setHasPermission(false);
      return false;
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleClick = async () => {
    if (!isConnected) {
      return;
    }

    if (hasPermission === false || hasPermission === null) {
      await requestMicrophonePermission();
    } else {
      onToggleMute();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-10 h-10";
      case "lg":
        return "w-16 h-16";
      default:
        return "w-12 h-12";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  const getButtonClasses = () => {
    const baseClasses = `${getSizeClasses()} rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800`;

    if (!isConnected) {
      return `${baseClasses} bg-gray-600 cursor-not-allowed text-gray-400`;
    }

    if (hasPermission === false) {
      return `${baseClasses} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
    }

    if (isRequestingPermission) {
      return `${baseClasses} bg-yellow-600 animate-pulse text-white focus:ring-yellow-500`;
    }

    if (isMuted) {
      return `${baseClasses} bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500`;
    }

    if (isListening) {
      // Animación cuando es el turno del usuario
      return `${baseClasses} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 animate-pulse`;
    }

    if (isSpeaking) {
      // Animación cuando puede interrumpir al agente
      return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 animate-bounce`;
    }

    return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500`;
  };

  const getIcon = () => {
    if (isRequestingPermission) {
      return (
        <FontAwesomeIcon
          icon={faSpinner}
          className={`${getIconSize()} animate-spin`}
        />
      );
    }

    if (hasPermission === false) {
      return (
        <FontAwesomeIcon icon={faExclamationCircle} className={getIconSize()} />
      );
    }

    if (isMuted) {
      return (
        <FontAwesomeIcon icon={faMicrophoneSlash} className={getIconSize()} />
      );
    }

    return <FontAwesomeIcon icon={faMicrophone} className={getIconSize()} />;
  };

  const getTooltipText = () => {
    if (!isConnected) return "Conecta primero";
    if (hasPermission === false)
      return "Permiso denegado - Haz clic para solicitar";
    if (isRequestingPermission) return "Solicitando permiso...";
    if (isMuted) return "Micrófono silenciado - Haz clic para activar";
    if (isListening) return "Es tu turno - Habla ahora";
    if (isSpeaking) return "Puedes interrumpir - Haz clic para hablar";
    return "Haz clic para hablar";
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleClick}
        disabled={!isConnected || isRequestingPermission}
        className={getButtonClasses()}
        title={getTooltipText()}
      >
        {getIcon()}
      </button>

      {/* Indicador de estado */}
      {(isListening || isSpeaking) && !isMuted && (
        <div className="absolute -inset-1 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
      )}
    </div>
  );
};

export default MicButton;

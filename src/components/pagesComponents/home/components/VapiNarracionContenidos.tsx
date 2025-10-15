import React, { useState } from "react";
import { useVapiAgent } from "../../../../hooks/useVapi";

const VapiNarracionContenidos = () => {
  const [userMessage, setUserMessage] = useState("");
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "agent";
      message: string;
      timestamp: Date;
    }>
  >([]);
  const [quickActions] = useState([
    "Narra este texto para mí",
    "Lee este párrafo con énfasis",
    "Cuéntame una historia",
    "Narra un documento técnico",
    "Lee este diálogo",
  ]);

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
    callId,
    callStatus,
  } = useVapiAgent("narracion-contenidos");

  const handleSendMessage = () => {
    if (userMessage.trim() && isConnected) {
      // Agregar mensaje del usuario al historial
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "user",
          message: userMessage,
          timestamp: new Date(),
        },
      ]);

      // Enviar mensaje al agente
      sendMessage(userMessage);
      setUserMessage("");
    }
  };

  const handleQuickAction = (action: string) => {
    if (isConnected) {
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "user",
          message: action,
          timestamp: new Date(),
        },
      ]);
      sendMessage(action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = () => {
    if (error) return "text-red-500";
    if (isConnected) return "text-green-500";
    if (isConnecting) return "text-yellow-500";
    return "text-gray-500";
  };

  const getStatusText = () => {
    if (error) return "Error";
    if (isConnected) return "Conectado";
    if (isConnecting) return "Conectando...";
    return "Desconectado";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          Narración de Contenidos (VAPI)
        </h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor().replace("text-", "bg-")}`}
          ></div>
          <span className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Información de la llamada */}
      {callId && (
        <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-200 text-sm font-medium">
                ID de Llamada: {callId}
              </p>
              <p className="text-blue-300 text-xs">Estado: {callStatus}</p>
            </div>
            <div className="text-blue-400 text-xs">Plataforma: VAPI</div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Controles de conexión */}
      <div className="flex flex-wrap gap-3">
        {!isConnected ? (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            {isConnecting ? "Conectando..." : "Conectar"}
          </button>
        ) : (
          <>
            <button
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Desconectar
            </button>
            <button
              onClick={startConversation}
              disabled={isSpeaking || isListening}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Iniciar Narración
            </button>
            <button
              onClick={stopConversation}
              disabled={!isSpeaking && !isListening}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Detener Narración
            </button>
            <button
              onClick={toggleMute}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                isMuted
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isMuted ? "Desmutear" : "Mutear"}
            </button>
          </>
        )}
      </div>

      {/* Indicadores de estado */}
      <div className="flex space-x-4">
        {isSpeaking && (
          <div className="flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Narrando</span>
          </div>
        )}
        {isListening && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Escuchando</span>
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      {isConnected && (
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            Tipos de Narración
          </h4>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={`quick-action-${action.slice(0, 20)}`}
                onClick={() => handleQuickAction(action)}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-1 rounded-full transition-colors duration-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Área de conversación */}
      <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
        <div className="space-y-3">
          {conversationHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              ¡Bienvenido! Soy tu narrador profesional con VAPI. ¿Qué contenido
              te gustaría que narre?
            </p>
          ) : (
            conversationHistory.map((entry, index) => (
              <div
                key={`${entry.timestamp.getTime()}-${index}`}
                className={`flex ${entry.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    entry.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-200"
                  }`}
                >
                  <p className="text-sm">{entry.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {entry.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input de mensaje */}
      <div className="flex space-x-3">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe el texto que quieres que narre..."
          disabled={!isConnected}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !userMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Enviar
        </button>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">
          Información del Caso de Uso
        </h4>
        <p className="text-xs text-gray-400">
          Este narrador profesional está diseñado para crear experiencias de
          audio envolventes y de alta calidad usando VAPI. Puede narrar
          audiolibros, documentales, podcasts y más.
        </p>
        <div className="mt-2 text-xs text-gray-500">
          <p>• Plataforma: VAPI</p>
          <p>• Modelo: GPT-4o</p>
          <p>• Transcripción: Deepgram</p>
          <p>• Voz: ElevenLabs</p>
          <p>• Especialidad: Narración profesional</p>
        </div>
      </div>
    </div>
  );
};

export default VapiNarracionContenidos;

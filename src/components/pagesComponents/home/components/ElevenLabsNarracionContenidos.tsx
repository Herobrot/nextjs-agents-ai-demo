import React, { useState } from 'react';
import { useElevenLabsAgent } from '../../../../hooks/useElevenLabs';
import {
  AgentHeader,
  ConnectionControls,
  StatusIndicators,
  SampleTexts,
  NarrationTextArea,
  NarrationHistory,
  ErrorDisplay,
  UseCaseInfo,
  MicButton
} from '../../../../components/shared';

const ElevenLabsNarracionContenidos = () => {
  const [textToNarrate, setTextToNarrate] = useState('');
  const [narrationHistory, setNarrationHistory] = useState<Array<{
    text: string;
    timestamp: Date;
    duration?: number;
  }>>([]);
  const [sampleTexts] = useState([
    {
      text: 'Bienvenidos a nuestro canal. Hoy hablaremos sobre las últimas tendencias en tecnología.',
    },
    {
      text: 'En un mundo cada vez más digital, la inteligencia artificial está transformando nuestras vidas.',
    },
    {
      text: 'La historia de la humanidad está marcada por momentos de innovación y cambio.',
    },
    {
      text: 'El futuro pertenece a aquellos que se atreven a soñar y a trabajar por sus metas.',
    },
    {
      text: 'La educación es la base del progreso y el desarrollo de cualquier sociedad.',
    }
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
    isMuted
  } = useElevenLabsAgent('narracion-contenidos');

  const handleNarrateText = () => {
    if (textToNarrate.trim() && isConnected) {      
      setNarrationHistory(prev => [...prev, {
        text: textToNarrate,
        timestamp: new Date()
      }]);
            
      sendMessage(textToNarrate);
      setTextToNarrate('');
    }
  };

  const handleSampleText = (sample: string) => {
    if (isConnected) {
      setNarrationHistory(prev => [...prev, {
        text: sample,
        timestamp: new Date()
      }]);
      sendMessage(sample);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNarrateText();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      <AgentHeader
        title="Narración de Contenidos"
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
      />

      <ErrorDisplay error={error} />

      <ConnectionControls
        isConnected={isConnected}
        isConnecting={isConnecting}
        isSpeaking={isSpeaking}
        isListening={isListening}
        isMuted={isMuted}
        onConnect={connect}
        onDisconnect={disconnect}
        onStartConversation={startConversation}
        onStopConversation={stopConversation}
        onToggleMute={toggleMute}
        startButtonText="Iniciar Narración"
        stopButtonText="Detener Narración"
      />

      <StatusIndicators
        isSpeaking={isSpeaking}
        isListening={isListening}
        speakingText="Narrando"
        listeningText="Preparando"
      />

      {/* Botón de micrófono */}
      <div className="flex justify-center">
        <MicButton
          isConnected={isConnected}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          size="lg"
        />
      </div>

      <SampleTexts
        samples={sampleTexts}
        onSampleClick={handleSampleText}
        isVisible={isConnected}
      />

      <NarrationTextArea
        value={textToNarrate}
        onChange={setTextToNarrate}
        onKeyUp={handleKeyPress}
        disabled={!isConnected}
      />

      {/* Botón de narración */}
      <div className="flex justify-center">
        <button
          onClick={handleNarrateText}
          disabled={!isConnected || !textToNarrate.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          Narrar Texto
        </button>
      </div>

      <NarrationHistory
        history={narrationHistory}
      />

      <UseCaseInfo
        title="Información del Caso de Uso"
        description="Este narrador está optimizado para contenido multimedia con voz clara y expresiva. Ideal para podcasts, audiolibros, presentaciones y contenido educativo. Configura el agentId y el prompt inicial en el archivo de configuración."
      />
    </div>
  );
};

export default ElevenLabsNarracionContenidos;

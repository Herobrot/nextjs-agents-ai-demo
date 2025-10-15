import React, { useState } from 'react';
import Header from './components/Header';
import UseCaseSelector from './components/UseCaseSelector';
import PlatformSelector from './components/PlatformSelector';
import ComparisonCard from './components/ComparisonCard';
import ElevenLabsAtencionCliente from './components/ElevenLabsAtencionCliente';
import ElevenLabsAtencionClienteComputadoras from './components/ElevenLabsAtencionClienteComputadoras';
import ElevenLabsAsistenteVirtual from './components/ElevenLabsAsistenteVirtual';
import ElevenLabsNarracionContenidos from './components/ElevenLabsNarracionContenidos';
import ElevenLabsEntrevistador from './components/ElevenLabsEntrevistador';
import VapiAtencionCliente from './components/VapiAtencionCliente';
import VapiAtencionClienteComputadoras from './components/VapiAtencionClienteComputadoras';
import VapiAsistenteVirtual from './components/VapiAsistenteVirtual';
import VapiNarracionContenidos from './components/VapiNarracionContenidos';
import VapiEntrevistador from './components/VapiEntrevistador';
import VapiTest from './components/VapiTest';
import Footer from './components/Footer';
import { metrics } from '../../../utils/metrics';

const HomePage = () => {
  const [selectedUseCase, setSelectedUseCase] = useState('atencion-cliente');
  const [selectedPlatform, setSelectedPlatform] = useState('elevenlabs');

  const handleUseCaseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUseCase(event.target.value);
  };

  const handlePlatformChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlatform(event.target.value);
  };

  const renderElevenLabsComponent = () => {
    switch (selectedUseCase) {
      case 'atencion-cliente':
        return <ElevenLabsAtencionCliente />;
      case 'atencion-cliente-computadoras':
        return <ElevenLabsAtencionClienteComputadoras />;
      case 'asistente-virtual':
        return <ElevenLabsAsistenteVirtual />;
      case 'narracion-contenidos':
        return <ElevenLabsNarracionContenidos />;
      case 'entrevistador':
        return <ElevenLabsEntrevistador />;
      default:
        return <ElevenLabsAtencionCliente />;
    }
  };

  const renderVapiComponent = () => {
    switch (selectedUseCase) {
      case 'atencion-cliente':
        return <VapiAtencionCliente />;
      case 'atencion-cliente-computadoras':
        return <VapiAtencionClienteComputadoras />;
      case 'asistente-virtual':
        return <VapiAsistenteVirtual />;
      case 'narracion-contenidos':
        return <VapiNarracionContenidos />;
      case 'entrevistador':
        return <VapiEntrevistador />;
      case 'test':
        return <VapiTest />;
      default:
        return <VapiAtencionCliente />;
    }
  };

  const renderComparisonComponent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white text-center">ElevenLabs</h3>
          {renderElevenLabsComponent()}
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white text-center">VAPI</h3>
          {renderVapiComponent()}
        </div>
      </div>
    );
  };

  const renderComponent = () => {
    switch (selectedPlatform) {
      case 'elevenlabs':
        return renderElevenLabsComponent();
      case 'vapi':
        return renderVapiComponent();
      case 'comparison':
        return renderComparisonComponent();
      default:
        return renderElevenLabsComponent();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Fondo con patrón sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Header />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          
          {/* Sección de selección de caso de uso */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Agent Testing Platform
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Prueba diferentes casos de uso con agentes de voz inteligentes. 
                Compara ElevenLabs y VAPI lado a lado o prueba cada plataforma individualmente.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PlatformSelector 
                selectedValue={selectedPlatform} 
                onChange={handlePlatformChange} 
              />
              <UseCaseSelector 
                selectedValue={selectedUseCase} 
                onChange={handleUseCaseChange} 
              />
            </div>
          </div>
          
          {/* Componente según la plataforma y caso seleccionado */}
          <div className="space-y-6">
            {selectedPlatform !== 'comparison' && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  {selectedUseCase === 'atencion-cliente' && 'Atención al Cliente'}
                  {selectedUseCase === 'atencion-cliente-computadoras' && 'Atención al Cliente - Computadoras'}
                  {selectedUseCase === 'asistente-virtual' && 'Asistente Virtual'}
                  {selectedUseCase === 'narracion-contenidos' && 'Narración de Contenidos'}
                  {selectedUseCase === 'entrevistador' && 'Entrevistador'}
                  {selectedUseCase === 'test' && 'Test VAPI'}
                  {selectedPlatform === 'elevenlabs' && ' (ElevenLabs)'}
                  {selectedPlatform === 'vapi' && ' (VAPI)'}
                </h2>
                <p className="text-gray-400">
                  {selectedUseCase === 'atencion-cliente' && 'Asistente profesional para soporte al cliente'}
                  {selectedUseCase === 'atencion-cliente-computadoras' && 'Especialista en hardware de PC (José de TecnoNeuro)'}
                  {selectedUseCase === 'asistente-virtual' && 'Asistente conversacional para tareas generales'}
                  {selectedUseCase === 'narracion-contenidos' && 'Narrador profesional para contenido multimedia'}
                  {selectedUseCase === 'entrevistador' && 'Entrevistadora experta para evaluaciones de candidatos'}
                  {selectedUseCase === 'entrevistador' && 'Entrevistadora experta para evaluaciones de candidatos'}
                  {selectedUseCase === 'test' && 'Componente de prueba para verificar la conexión con VAPI'}
                </p>
              </div>
            )}
            
            {selectedPlatform === 'comparison' && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Comparación Lado a Lado
                </h2>
                <p className="text-gray-400">
                  Compara ElevenLabs y VAPI en tiempo real con el mismo caso de uso
                </p>
              </div>
            )}
            
            <div className={`mx-auto ${selectedPlatform === 'comparison' ? 'max-w-7xl' : 'max-w-5xl'}`}>
              {renderComponent()}
            </div>
          </div>

          {/* Comparación de métricas */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Comparación de Plataformas
              </h2>
              <p className="text-gray-400">
                Compara las métricas entre Vapi y ElevenLabs
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <div className="transform hover:scale-105 transition-transform duration-300">
                <ComparisonCard 
                  title="Vapi" 
                  data={metrics.vapi} 
                />
              </div>
              <div className="transform hover:scale-105 transition-transform duration-300">
                <ComparisonCard 
                  title="ElevenLabs" 
                  data={metrics.elevenlabs} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
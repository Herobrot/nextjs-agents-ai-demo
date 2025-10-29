// Importaciones de los archivos de prompt
import { atencionClientePrompt } from "../config/prompts/atencion-cliente";
import { asistenteVirtualPrompt } from "../config/prompts/asistente-virtual";
import { narracionContenidosPrompt } from "../config/prompts/narracion-contenidos";
import { atencionClienteComputadorasPrompt } from "../config/prompts/atencion-cliente-computadoras";
import {
  entrevistadorPromptElevenLabs,
  entrevistadorVapi,
} from "../config/prompts/entrevistador";
import { entrevistadorAlimentosPromptElevenLabs } from "@/config/prompts/entrevistador-alimentos";

// Mapeo de prompts por caso de uso
export const prompts = {
  "atencion-cliente": atencionClientePrompt,
  "asistente-virtual": asistenteVirtualPrompt,
  "narracion-contenidos": narracionContenidosPrompt,
  "atencion-cliente-computadoras": atencionClienteComputadorasPrompt,
  "entrevistador": entrevistadorPromptElevenLabs,
  "entrevistador-alimentos": entrevistadorAlimentosPromptElevenLabs,
} as const;

// Mapeo específico de prompts para VAPI
export const vapiPrompts = {
  "atencion-cliente": atencionClientePrompt,
  "asistente-virtual": asistenteVirtualPrompt,
  "narracion-contenidos": narracionContenidosPrompt,
  "atencion-cliente-computadoras": atencionClienteComputadorasPrompt,
  entrevistador: entrevistadorVapi,
} as const;

// Función para obtener un prompt por caso de uso (ElevenLabs)
export const getPromptForUseCase = (useCase: keyof typeof prompts): string => {
  return prompts[useCase] || "";
};

// Función para obtener un prompt por caso de uso (VAPI)
export const getVapiPromptForUseCase = (
  useCase: keyof typeof vapiPrompts,
): string => {
  return vapiPrompts[useCase] || "";
};

// Función para obtener todos los prompts (ElevenLabs)
export const getAllPrompts = () => {
  return prompts;
};

// Función para obtener todos los prompts (VAPI)
export const getAllVapiPrompts = () => {
  return vapiPrompts;
};

// Tipos para TypeScript
export type UseCasePromptKey = keyof typeof prompts;
export type VapiUseCasePromptKey = keyof typeof vapiPrompts;

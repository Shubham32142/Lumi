// AI provider catalog. Users bring their own API key; the app calls the provider
// directly from the device so keys never touch our servers and Luna works in
// local mode. Providers with a small curated model list use a dropdown; the
// open-ended ones (OpenAI, OpenRouter) use a free-text model field.
import type { SelectOption } from '@/components/ui';

export type ProviderId = 'anthropic' | 'gemini' | 'openai' | 'openrouter';

export interface ProviderMeta {
  id: ProviderId;
  label: string;
  modelInput: 'dropdown' | 'text';
  models?: SelectOption[]; // present when modelInput === 'dropdown'
  defaultModel: string;
  keyLabel: string;
  keyPlaceholder: string;
  /** Where to get a key (shown as a hint). */
  keyHelp: string;
}

export const PROVIDERS: Record<ProviderId, ProviderMeta> = {
  anthropic: {
    id: 'anthropic',
    label: 'Claude (Anthropic)',
    modelInput: 'dropdown',
    models: [
      { value: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6 (balanced)' },
      { value: 'claude-opus-4-8', label: 'Claude Opus 4.8 (most capable)' },
      { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (fast)' },
    ],
    defaultModel: 'claude-sonnet-4-6',
    keyLabel: 'Anthropic API key',
    keyPlaceholder: 'sk-ant-…',
    keyHelp: 'console.anthropic.com',
  },
  gemini: {
    id: 'gemini',
    label: 'Gemini (Google)',
    modelInput: 'dropdown',
    models: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (fast)' },
      { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    ],
    defaultModel: 'gemini-2.0-flash',
    keyLabel: 'Google AI API key',
    keyPlaceholder: 'AIza…',
    keyHelp: 'aistudio.google.com/apikey',
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    modelInput: 'text',
    defaultModel: 'gpt-4o-mini',
    keyLabel: 'OpenAI API key',
    keyPlaceholder: 'sk-…',
    keyHelp: 'platform.openai.com/api-keys',
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    modelInput: 'text',
    defaultModel: 'openai/gpt-4o-mini',
    keyLabel: 'OpenRouter API key',
    keyPlaceholder: 'sk-or-…',
    keyHelp: 'openrouter.ai/keys',
  },
};

export const PROVIDER_OPTIONS: SelectOption[] = Object.values(PROVIDERS).map((p) => ({
  value: p.id,
  label: p.label,
}));

export interface AiConfig {
  provider: ProviderId;
  apiKey: string;
  model: string;
}

export const DEFAULT_AI_CONFIG: AiConfig = {
  provider: 'anthropic',
  apiKey: '',
  model: PROVIDERS.anthropic.defaultModel,
};

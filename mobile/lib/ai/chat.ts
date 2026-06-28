// Unified chat across providers. Called directly from the device with the
// user's own key. Each adapter normalizes to { reply: string } or throws a
// friendly Error.
import type { AiConfig } from './providers';

export interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_TOKENS = 1024;

export async function chatWithProvider(
  cfg: AiConfig,
  system: string,
  messages: ChatMsg[],
): Promise<string> {
  if (!cfg.apiKey) throw new Error('No API key set. Add one in Settings → Luna & AI.');
  switch (cfg.provider) {
    case 'anthropic':
      return anthropicChat(cfg, system, messages);
    case 'gemini':
      return geminiChat(cfg, system, messages);
    case 'openai':
    case 'openrouter':
      return openAICompatibleChat(cfg, system, messages);
    default:
      throw new Error('Unknown provider.');
  }
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.error?.message ?? data?.error ?? data?.message ?? `${fallback} (${res.status})`;
  } catch {
    return `${fallback} (${res.status})`;
  }
}

async function anthropicChat(cfg: AiConfig, system: string, messages: ChatMsg[]): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      // device (not a browser), but set this so the request isn't blocked
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model: cfg.model, max_tokens: MAX_TOKENS, system, messages }),
  });
  if (!res.ok) throw new Error(await readError(res, 'Claude request failed'));
  const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
  const block = data.content?.find((b) => b.type === 'text');
  return block?.text ?? '…';
}

async function openAICompatibleChat(
  cfg: AiConfig,
  system: string,
  messages: ChatMsg[],
): Promise<string> {
  const base =
    cfg.provider === 'openrouter' ? 'https://openrouter.ai/api/v1' : 'https://api.openai.com/v1';
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(await readError(res, 'Request failed'));
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? '…';
}

async function geminiChat(cfg: AiConfig, system: string, messages: ChatMsg[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    cfg.model,
  )}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
  });
  if (!res.ok) throw new Error(await readError(res, 'Gemini request failed'));
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? '').join('') || '…';
}

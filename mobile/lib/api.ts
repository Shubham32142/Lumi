// Thin client for the optional Next.js backend (accounts + cloud sync).
// Luna/AI does NOT go through here — it runs on-device with the user's own
// provider key (see lib/ai). These calls are only used once an account exists.
import Constants from 'expo-constants';

// Default to the hosted backend; override via app.json `extra.apiBaseUrl`
// (e.g. set it to http://localhost:3000 for local backend development).
const BASE_URL =
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  'https://lumi-xbka.vercel.app';

export class ApiError extends Error {}

async function postJSON<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new ApiError(message);
  }
  return res.json() as Promise<T>;
}

// ── Auth & sync (used once an account exists) ──
export function signup(email: string, password: string): Promise<{ token: string }> {
  return postJSON<{ token: string }>('/api/auth/signup', { email, password });
}

export function login(email: string, password: string): Promise<{ token: string }> {
  return postJSON<{ token: string }>('/api/auth/login', { email, password });
}

export { BASE_URL };

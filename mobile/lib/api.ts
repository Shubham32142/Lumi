// Client for the optional backend (accounts + cloud sync). Luna/AI does NOT go
// through here — it runs on-device with the user's own provider key (lib/ai).
import Constants from 'expo-constants';
import type { CycleLog, Phase, Profile } from '@/lib/types';

// Default to the hosted backend; override via app.json `extra.apiBaseUrl`
// (e.g. set it to http://localhost:3000 for local backend development).
const BASE_URL =
  (Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined)?.apiBaseUrl ??
  'https://lumi-xbka.vercel.app';

export class ApiError extends Error {}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
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
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

// ── Auth ──
export interface AuthResult {
  token: string;
  userId: string;
}
export function signup(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('POST', '/api/auth/signup', { email, password });
}
export function login(email: string, password: string): Promise<AuthResult> {
  return request<AuthResult>('POST', '/api/auth/login', { email, password });
}

// ── Profile sync (periodStarts + bookmarks travel with the profile) ──
export interface ProfileSync {
  profile: Partial<Profile>;
  periodStarts: string[];
  bookmarks: string[];
}
export function getProfile(token: string): Promise<ProfileSync> {
  return request<ProfileSync>('GET', '/api/profile', undefined, token);
}
export function putProfile(token: string, data: ProfileSync): Promise<ProfileSync> {
  return request<ProfileSync>('PUT', '/api/profile', data, token);
}

// ── Log sync ──
export function getLogs(token: string): Promise<{ logs: CycleLog[] }> {
  return request<{ logs: CycleLog[] }>('GET', '/api/logs', undefined, token);
}
export function putLog(token: string, log: CycleLog): Promise<{ log: CycleLog }> {
  return request<{ log: CycleLog }>('POST', '/api/logs', log, token);
}

// ── Account ──
export function deleteAccount(token: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('DELETE', '/api/account', undefined, token);
}

// ── Partner linking ──
export interface PartnerSnapshot {
  linked: boolean;
  enabled?: boolean;
  phase?: Phase | null;
  dayOfCycle?: number | null;
  daysUntilNextPeriod?: number | null;
  shares?: { mood: boolean; energy: boolean; symptoms: boolean };
  today?: {
    mood: string | null;
    energy: string | null;
    flow: string | null;
    cravings: string[] | null;
  };
}
export function linkPartner(token: string, code: string): Promise<{ ok: boolean; snapshot: PartnerSnapshot }> {
  return request('POST', '/api/partner/link', { code }, token);
}
export function getPartnerSnapshot(token: string): Promise<PartnerSnapshot> {
  return request('GET', '/api/partner/snapshot', undefined, token);
}
export function unlinkPartner(token: string): Promise<{ ok: boolean }> {
  return request('POST', '/api/partner/unlink', {}, token);
}
export function getPartnerLinks(token: string): Promise<{ partners: { id: string; email: string }[] }> {
  return request('GET', '/api/partner/links', undefined, token);
}
export function removePartner(token: string, partnerId: string): Promise<{ ok: boolean }> {
  return request('DELETE', '/api/partner/links', { partnerId }, token);
}

export { BASE_URL };

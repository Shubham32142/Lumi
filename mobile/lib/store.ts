// Local-first app state. Persists to the device with AsyncStorage so the whole
// app works with no account. When the user signs in, the same data syncs to the
// backend: changes push up immediately, and a pull-merge runs on login/app-open.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CycleLog, Profile, SymptomKey } from '@/lib/types';
import { estimateCycleLength } from '@/lib/cycle';
import { addDays, todayISO } from '@/lib/date';
import { DEFAULT_AI_CONFIG, type AiConfig } from '@/lib/ai/providers';
import { getLogs, getProfile, putLog, putProfile, type ProfileSync } from '@/lib/api';

export const DEFAULT_TRACKED: SymptomKey[] = [
  'mood',
  'energy',
  'pain',
  'cravings',
  'bloating',
  'sleep',
  'flow',
];

export const DEFAULT_PROFILE: Profile = {
  experienceLevel: 'somewhat_familiar',
  ageRange: '18-25',
  cycleLength: 28,
  periodLength: 5,
  lastPeriodDate: null,
  isIrregular: false,
  trackedSymptoms: DEFAULT_TRACKED,
  notificationPrefs: {
    enabled: false,
    dailyCheckInTime: null,
    periodReminders: true,
    phaseTransitions: true,
    selfCareNudges: true,
  },
  partnerSharing: {
    enabled: false,
    inviteCode: null,
    shareMood: true,
    shareEnergy: true,
    shareSymptoms: false,
  },
};

export interface Session {
  token: string;
  userId: string;
  email: string;
}

// ── Cloud push helpers (fire-and-forget; failures are non-fatal) ──
function buildProfileSync(s: AppState): ProfileSync {
  return { profile: s.profile, periodStarts: s.periodStarts, bookmarks: s.bookmarks };
}
function pushProfileUp(token: string, s: AppState) {
  void putProfile(token, buildProfileSync(s)).catch(() => {});
}
function pushLogUp(token: string, log: CycleLog) {
  void putLog(token, log).catch(() => {});
}
function stripUndefined(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k in o) if (o[k] !== undefined) out[k] = o[k];
  return out;
}

interface AppState {
  hydrated: boolean;
  onboarded: boolean;
  profile: Profile;
  logs: Record<string, CycleLog>; // keyed by ISO date
  periodStarts: string[]; // logged period start dates (for learning cycle length)
  bookmarks: string[]; // bookmarked article ids
  aiConfig: AiConfig; // user's own AI provider + key (stored on-device only — never synced)
  session: Session | null; // null = local mode
  syncing: boolean;

  completeOnboarding: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  upsertLog: (date: string, patch: Partial<CycleLog>) => void;
  getLog: (date: string) => CycleLog | undefined;
  logPeriodStart: (date: string) => void;
  toggleBookmark: (id: string) => void;
  setAiConfig: (patch: Partial<AiConfig>) => void;
  setSession: (session: Session) => void;
  clearSession: () => void;
  cloudSync: (reconcile?: boolean) => Promise<void>;
  loggedDatesDescending: () => string[];
  currentStreak: () => number;
  resetAll: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      profile: DEFAULT_PROFILE,
      logs: {},
      periodStarts: [],
      bookmarks: [],
      aiConfig: DEFAULT_AI_CONFIG,
      session: null,
      syncing: false,

      completeOnboarding: (profile) => {
        const starts = profile.lastPeriodDate ? [profile.lastPeriodDate] : [];
        set({ onboarded: true, profile, periodStarts: starts });
        const s = get();
        if (s.session) pushProfileUp(s.session.token, s);
      },

      updateProfile: (patch) => {
        set((s) => ({ profile: { ...s.profile, ...patch } }));
        const s = get();
        if (s.session) pushProfileUp(s.session.token, s);
      },

      upsertLog: (date, patch) => {
        set((s) => {
          const existing = s.logs[date];
          const merged: CycleLog = {
            date,
            ...existing,
            ...patch,
            updatedAt: new Date().toISOString(),
          };
          return { logs: { ...s.logs, [date]: merged } };
        });
        const s = get();
        if (s.session) pushLogUp(s.session.token, s.logs[date]!);
      },

      getLog: (date) => get().logs[date],

      logPeriodStart: (date) => {
        set((s) => {
          if (s.periodStarts.includes(date)) return s;
          const starts = [...s.periodStarts, date].sort();
          const learned = estimateCycleLength(starts, s.profile.cycleLength);
          return {
            periodStarts: starts,
            profile: {
              ...s.profile,
              lastPeriodDate: starts[starts.length - 1],
              cycleLength: learned,
            },
          };
        });
        const s = get();
        if (s.session) pushProfileUp(s.session.token, s);
      },

      toggleBookmark: (id) => {
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        }));
        const s = get();
        if (s.session) pushProfileUp(s.session.token, s);
      },

      setAiConfig: (patch) => set((s) => ({ aiConfig: { ...s.aiConfig, ...patch } })),

      setSession: (session) => set({ session }),

      // Logging out keeps local data on the device; only the cloud link is dropped.
      clearSession: () => set({ session: null }),

      cloudSync: async (reconcile = false) => {
        const session = get().session;
        if (!session || get().syncing) return;
        set({ syncing: true });
        try {
          const [prof, logsRes] = await Promise.all([
            getProfile(session.token),
            getLogs(session.token),
          ]);
          set((s) => {
            // Logs: most-recently-updated wins.
            const mergedLogs: Record<string, CycleLog> = { ...s.logs };
            for (const log of logsRes.logs ?? []) {
              const local = mergedLogs[log.date];
              if (!local || (log.updatedAt ?? '') > (local.updatedAt ?? '')) {
                mergedLogs[log.date] = log;
              }
            }
            // Profile: take cloud values when the cloud account actually has data
            // (so a brand-new account doesn't wipe freshly-onboarded local data).
            const cloud = (prof.profile ?? {}) as Record<string, unknown>;
            const cloudHasData =
              Boolean(cloud.lastPeriodDate) || (prof.periodStarts?.length ?? 0) > 0;
            const profile = cloudHasData
              ? ({ ...s.profile, ...stripUndefined(cloud) } as Profile)
              : s.profile;
            const periodStarts = Array.from(
              new Set([...(s.periodStarts ?? []), ...(prof.periodStarts ?? [])]),
            ).sort();
            const bookmarks = Array.from(
              new Set([...(s.bookmarks ?? []), ...(prof.bookmarks ?? [])]),
            );
            return { logs: mergedLogs, profile, periodStarts, bookmarks };
          });

          // After a login reconcile, push the merged union back so the cloud holds it.
          if (reconcile) {
            const s = get();
            pushProfileUp(session.token, s);
            for (const log of Object.values(s.logs)) pushLogUp(session.token, log);
          }
        } finally {
          set({ syncing: false });
        }
      },

      loggedDatesDescending: () =>
        Object.keys(get().logs).sort((a, b) => (a < b ? 1 : -1)),

      currentStreak: () => {
        const logs = get().logs;
        let streak = 0;
        let cursor = todayISO();
        // Count back day-by-day while a log exists; stop at the first gap.
        while (logs[cursor]) {
          streak += 1;
          cursor = addDays(cursor, -1);
        }
        return streak;
      },

      resetAll: () =>
        set({
          onboarded: false,
          profile: DEFAULT_PROFILE,
          logs: {},
          periodStarts: [],
          bookmarks: [],
          aiConfig: DEFAULT_AI_CONFIG,
          session: null,
        }),
    }),
    {
      name: 'cycle-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        onboarded: s.onboarded,
        profile: s.profile,
        logs: s.logs,
        periodStarts: s.periodStarts,
        bookmarks: s.bookmarks,
        aiConfig: s.aiConfig,
        session: s.session,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration so the UI can avoid a flash of the wrong route.
        useStore.setState({ hydrated: true });
        void state;
      },
    },
  ),
);

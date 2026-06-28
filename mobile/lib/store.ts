// Local-first app state. Persists to the device with AsyncStorage so the whole
// app works with no account (the "Local mode" in the requirements). When an
// account is added later, this same shape syncs to the backend.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CycleLog, Profile, SymptomKey } from '@/lib/types';
import { estimateCycleLength } from '@/lib/cycle';
import { addDays, todayISO } from '@/lib/date';
import { DEFAULT_AI_CONFIG, type AiConfig } from '@/lib/ai/providers';

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

interface AppState {
  hydrated: boolean;
  onboarded: boolean;
  profile: Profile;
  logs: Record<string, CycleLog>; // keyed by ISO date
  periodStarts: string[]; // logged period start dates (for learning cycle length)
  bookmarks: string[]; // bookmarked article ids
  aiConfig: AiConfig; // user's own AI provider + key (stored on-device only)

  completeOnboarding: (profile: Profile) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  upsertLog: (date: string, patch: Partial<CycleLog>) => void;
  getLog: (date: string) => CycleLog | undefined;
  logPeriodStart: (date: string) => void;
  toggleBookmark: (id: string) => void;
  setAiConfig: (patch: Partial<AiConfig>) => void;
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

      completeOnboarding: (profile) => {
        const starts = profile.lastPeriodDate ? [profile.lastPeriodDate] : [];
        set({ onboarded: true, profile, periodStarts: starts });
      },

      updateProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),

      upsertLog: (date, patch) =>
        set((s) => {
          const existing = s.logs[date];
          const merged: CycleLog = {
            date,
            ...existing,
            ...patch,
            updatedAt: new Date().toISOString(),
          };
          return { logs: { ...s.logs, [date]: merged } };
        }),

      getLog: (date) => get().logs[date],

      logPeriodStart: (date) =>
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
        }),

      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((b) => b !== id)
            : [...s.bookmarks, id],
        })),

      setAiConfig: (patch) => set((s) => ({ aiConfig: { ...s.aiConfig, ...patch } })),

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
      }),
      onRehydrateStorage: () => (state) => {
        // Mark hydration so the UI can avoid a flash of the wrong route.
        useStore.setState({ hydrated: true });
        void state;
      },
    },
  ),
);

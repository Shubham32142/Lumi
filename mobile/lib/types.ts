// Core domain types shared across the app.
import type { PhaseKey } from '@/theme';

export type Phase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export type ExperienceLevel = 'first_timer' | 'somewhat_familiar' | 'know_my_cycle';
export type AgeRange = '13-17' | '18-25' | '26-35' | '36+';

// ── Symptom value sets (match the requirements doc) ──
export type Mood =
  | 'happy'
  | 'anxious'
  | 'irritable'
  | 'sad'
  | 'flat'
  | 'energized'
  | 'calm';
export type Energy = 'high' | 'medium' | 'low' | 'exhausted';
export type PainType = 'cramps' | 'headache' | 'back_pain' | 'breast_tenderness';
export type Craving = 'sweet' | 'salty' | 'carbs' | 'nothing' | 'everything';
export type Bloating = 'none' | 'mild' | 'bad';
export type SleepQuality = 'great' | 'ok' | 'poor';
export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';
export type MentalClarity = 'sharp' | 'foggy' | 'scattered';
export type SocialBattery = 'social' | 'neutral' | 'leave_me_alone';

/** Which symptom categories the user opted to track (all optional to log). */
export type SymptomKey =
  | 'mood'
  | 'energy'
  | 'pain'
  | 'cravings'
  | 'bloating'
  | 'sleep'
  | 'flow'
  | 'clarity'
  | 'social';

export interface PainEntry {
  type: PainType;
  intensity: number; // 1–5
}

/** One log per calendar day. `date` is an ISO date string (YYYY-MM-DD). */
export interface CycleLog {
  date: string;
  mood?: Mood;
  energy?: Energy;
  pain?: PainEntry[];
  cravings?: Craving[];
  bloating?: Bloating;
  sleepQuality?: SleepQuality;
  flowIntensity?: FlowIntensity;
  mentalClarity?: MentalClarity;
  socialBattery?: SocialBattery;
  notes?: string;
  updatedAt: string; // ISO timestamp
}

export interface NotificationPrefs {
  enabled: boolean;
  dailyCheckInTime: string | null; // "HH:MM" or null
  periodReminders: boolean;
  phaseTransitions: boolean;
  selfCareNudges: boolean;
}

/** What the partner is allowed to see (per-category consent). */
export interface PartnerSharing {
  enabled: boolean;
  inviteCode: string | null;
  shareMood: boolean;
  shareEnergy: boolean;
  shareSymptoms: boolean; // pain/flow/cravings — off by default
}

export interface Profile {
  experienceLevel: ExperienceLevel;
  ageRange: AgeRange;
  cycleLength: number; // average days
  periodLength: number; // average bleed days
  lastPeriodDate: string | null; // ISO date, null = "not sure"
  isIrregular: boolean;
  trackedSymptoms: SymptomKey[];
  notificationPrefs: NotificationPrefs;
  partnerSharing: PartnerSharing;
}

/** Result of the cycle engine for a given day. */
export interface PhaseInfo {
  phase: Phase;
  phaseKey: PhaseKey;
  dayOfCycle: number; // 1-indexed
  cycleLength: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CYCLE ENGINE — pure functions, the core of the product.
//
// Model: ovulation happens ~14 days before the next period (the luteal phase is
// the stable ~14-day part). This makes phase boundaries adapt to each user's
// cycle length instead of assuming a fixed 28-day textbook cycle, and keeps
// irregular cycles from feeling "wrong".
// ─────────────────────────────────────────────────────────────────────────────
import type { Phase, PhaseInfo, Profile } from '@/lib/types';
import type { PhaseKey } from '@/theme';
import { addDays, daysBetween, todayISO } from '@/lib/date';

const LUTEAL_LENGTH = 14;
const DEFAULT_PERIOD_LENGTH = 5;

const PHASE_TO_KEY: Record<Phase, PhaseKey> = {
  menstruation: 'flow',
  follicular: 'glow',
  ovulation: 'peak',
  luteal: 'dip',
};

export function phaseKeyOf(phase: Phase): PhaseKey {
  return PHASE_TO_KEY[phase];
}

/**
 * Which phase a given 1-indexed day of the cycle falls in.
 * Boundaries scale with cycleLength via the fixed luteal length.
 */
export function phaseForDay(
  day: number,
  cycleLength: number,
  periodLength: number = DEFAULT_PERIOD_LENGTH,
): Phase {
  if (day <= periodLength) return 'menstruation';

  // Ovulation day = cycleLength - 14 (clamped so it can't land in the period).
  const ovDay = Math.max(periodLength + 1, cycleLength - LUTEAL_LENGTH);

  if (day >= ovDay - 1 && day <= ovDay + 1) return 'ovulation';
  if (day < ovDay - 1) return 'follicular';
  return 'luteal';
}

/**
 * 1-indexed day of the cycle on `onDate`, wrapping across however many cycles
 * have elapsed since the last known period start. Returns null if unknown.
 */
export function dayOfCycle(profile: Profile, onDate: string = todayISO()): number | null {
  if (!profile.lastPeriodDate) return null;
  const elapsed = daysBetween(profile.lastPeriodDate, onDate);
  const len = profile.cycleLength;
  // Modulo that stays positive even for dates before the anchor.
  const mod = ((elapsed % len) + len) % len;
  return mod + 1;
}

/** Full phase info for a day, or null when there's no anchor date yet. */
export function phaseInfoFor(
  profile: Profile,
  onDate: string = todayISO(),
): PhaseInfo | null {
  const day = dayOfCycle(profile, onDate);
  if (day == null) return null;
  const phase = phaseForDay(day, profile.cycleLength, profile.periodLength);
  return {
    phase,
    phaseKey: PHASE_TO_KEY[phase],
    dayOfCycle: day,
    cycleLength: profile.cycleLength,
  };
}

/** ISO date of the next predicted period start strictly after `fromDate`. */
export function nextPeriodStart(
  profile: Profile,
  fromDate: string = todayISO(),
): string | null {
  if (!profile.lastPeriodDate) return null;
  const elapsed = daysBetween(profile.lastPeriodDate, fromDate);
  const len = profile.cycleLength;
  const cyclesAhead = Math.floor(elapsed / len) + 1;
  return addDays(profile.lastPeriodDate, cyclesAhead * len);
}

/** Days until the next predicted period (0 = starts today). */
export function daysUntilNextPeriod(
  profile: Profile,
  fromDate: string = todayISO(),
): number | null {
  const next = nextPeriodStart(profile, fromDate);
  if (!next) return null;
  return daysBetween(fromDate, next);
}

/** The next `count` predicted period start dates. */
export function upcomingPeriodStarts(
  profile: Profile,
  count: number,
  fromDate: string = todayISO(),
): string[] {
  const first = nextPeriodStart(profile, fromDate);
  if (!first) return [];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(addDays(first, i * profile.cycleLength));
  }
  return out;
}

/** Is `onDate` within a predicted bleeding window? (for calendar shading) */
export function isPredictedPeriodDay(profile: Profile, onDate: string): boolean {
  const day = dayOfCycle(profile, onDate);
  if (day == null) return false;
  return day <= profile.periodLength;
}

export interface PhaseRange {
  phase: Phase;
  startDay: number; // 1-indexed cycle day
  endDay: number;
  startISO: string;
  endISO: string;
}

/**
 * The four phase windows (with calendar dates) for the cycle that contains
 * `onDate`. Boundaries follow `phaseForDay`, so they scale with cycle length.
 * Returns null when there's no anchor date yet.
 */
export function cyclePhaseRanges(
  profile: Profile,
  onDate: string = todayISO(),
): PhaseRange[] | null {
  const day = dayOfCycle(profile, onDate);
  if (day == null) return null;
  const cycleStart = addDays(onDate, -(day - 1));
  const L = profile.cycleLength;
  const P = profile.periodLength;
  const ovDay = Math.max(P + 1, L - LUTEAL_LENGTH);

  const windows: { phase: Phase; startDay: number; endDay: number }[] = [
    { phase: 'menstruation', startDay: 1, endDay: P },
    { phase: 'follicular', startDay: P + 1, endDay: ovDay - 2 },
    { phase: 'ovulation', startDay: ovDay - 1, endDay: ovDay + 1 },
    { phase: 'luteal', startDay: ovDay + 2, endDay: L },
  ];

  return windows
    .filter((w) => w.endDay >= w.startDay)
    .map((w) => ({
      phase: w.phase,
      startDay: w.startDay,
      endDay: w.endDay,
      startISO: addDays(cycleStart, w.startDay - 1),
      endISO: addDays(cycleStart, w.endDay - 1),
    }));
}

/** ISO date of the start of the cycle that contains `onDate` (day 1). */
export function cycleStartOf(profile: Profile, onDate: string = todayISO()): string | null {
  const day = dayOfCycle(profile, onDate);
  if (day == null) return null;
  return addDays(onDate, -(day - 1));
}

/**
 * Learn cycle length from logged period-start dates. Averages the gaps between
 * consecutive starts; falls back to `fallback` when there isn't enough history.
 */
export function estimateCycleLength(
  periodStarts: string[],
  fallback: number,
): number {
  const sorted = [...periodStarts].sort();
  if (sorted.length < 2) return fallback;
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1], sorted[i]);
    // Ignore implausible gaps (double-logs or very long skips).
    if (gap >= 21 && gap <= 45) gaps.push(gap);
  }
  if (gaps.length === 0) return fallback;
  const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  return Math.round(avg);
}

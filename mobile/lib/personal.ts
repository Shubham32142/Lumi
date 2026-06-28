// Turns the user's OWN logs into personal insight, so logging visibly pays off:
// "the more you tell me, the better I know you." Pure functions over the store.
import type { CycleLog, Mood, Phase, Profile } from '@/lib/types';
import { phaseInfoFor } from '@/lib/cycle';

/**
 * The mood the user most often records during a given phase, across their whole
 * history. Returns null until there are at least a few data points (so we don't
 * pretend to know them after one log).
 */
export function commonMoodInPhase(
  profile: Profile,
  logs: Record<string, CycleLog>,
  phase: Phase,
): { mood: Mood; count: number } | null {
  const counts = new Map<Mood, number>();
  let total = 0;
  for (const log of Object.values(logs)) {
    if (!log.mood) continue;
    if (phaseInfoFor(profile, log.date)?.phase !== phase) continue;
    counts.set(log.mood, (counts.get(log.mood) ?? 0) + 1);
    total += 1;
  }
  if (total < 3) return null;
  let best: Mood | null = null;
  let bestCount = 0;
  for (const [mood, count] of counts) {
    if (count > bestCount) {
      best = mood;
      bestCount = count;
    }
  }
  return best ? { mood: best, count: bestCount } : null;
}

/** How many days the user has ever checked in (any mood/energy/etc. logged). */
export function checkInCount(logs: Record<string, CycleLog>): number {
  let n = 0;
  for (const log of Object.values(logs)) {
    if (log.mood || log.energy || log.bloating || log.sleepQuality || log.notes) n += 1;
  }
  return n;
}

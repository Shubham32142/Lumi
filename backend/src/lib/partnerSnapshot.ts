// Builds the partner-visible snapshot of an owner, enforcing her sharing consent
// SERVER-SIDE. The partner only ever receives phase/derived state plus the exact
// categories she turned on — never raw period dates or anything she didn't allow.
import { User } from '@/models/User';
import { CycleLog } from '@/models/CycleLog';
import { predict } from '@/lib/cycle';

type AnyRecord = Record<string, unknown>;

export interface PartnerSnapshot {
  linked: boolean;
  enabled: boolean;
  phase: string | null;
  dayOfCycle: number | null;
  daysUntilNextPeriod: number | null;
  shares: { mood: boolean; energy: boolean; symptoms: boolean };
  today: {
    mood: string | null;
    energy: string | null;
    flow: string | null;
    cravings: string[] | null;
  };
}

export async function buildSnapshot(ownerId: string): Promise<PartnerSnapshot | null> {
  const owner = await User.findById(ownerId).lean<AnyRecord | null>();
  if (!owner) return null;

  const sharing = (owner.partnerSharing ?? {}) as AnyRecord;
  const enabled = Boolean(sharing.enabled);
  const shareMood = Boolean(sharing.shareMood);
  const shareEnergy = Boolean(sharing.shareEnergy);
  const shareSymptoms = Boolean(sharing.shareSymptoms);

  // If she has turned sharing off, the partner sees nothing personal.
  if (!enabled) {
    return {
      linked: true,
      enabled: false,
      phase: null,
      dayOfCycle: null,
      daysUntilNextPeriod: null,
      shares: { mood: false, energy: false, symptoms: false },
      today: { mood: null, energy: null, flow: null, cravings: null },
    };
  }

  const p = predict({
    lastPeriodDate: (owner.lastPeriodDate as string | null) ?? null,
    cycleLength: (owner.cycleLength as number) ?? 28,
    periodLength: (owner.periodLength as number) ?? 5,
  });

  const today = new Date().toISOString().slice(0, 10);
  const log = await CycleLog.findOne({ userId: ownerId, date: today }).lean<AnyRecord | null>();

  return {
    linked: true,
    enabled: true,
    phase: p.phase,
    dayOfCycle: p.dayOfCycle,
    daysUntilNextPeriod: p.daysUntilNextPeriod,
    shares: { mood: shareMood, energy: shareEnergy, symptoms: shareSymptoms },
    today: {
      mood: shareMood ? ((log?.mood as string) ?? null) : null,
      energy: shareEnergy ? ((log?.energy as string) ?? null) : null,
      flow: shareSymptoms ? ((log?.flowIntensity as string) ?? null) : null,
      cravings: shareSymptoms ? ((log?.cravings as string[]) ?? null) : null,
    },
  };
}

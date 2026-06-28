// Server-side cycle math (mirrors the mobile engine). Pure functions.
export type Phase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LUTEAL_LENGTH = 14;

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date): string {
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function todayISO(): string {
  return toISO(new Date());
}
function addDays(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function daysBetween(a: string, b: string): number {
  return Math.round((parseISO(b).getTime() - parseISO(a).getTime()) / MS_PER_DAY);
}

export function phaseForDay(day: number, cycleLength: number, periodLength = 5): Phase {
  if (day <= periodLength) return 'menstruation';
  const ovDay = Math.max(periodLength + 1, cycleLength - LUTEAL_LENGTH);
  if (day >= ovDay - 1 && day <= ovDay + 1) return 'ovulation';
  if (day < ovDay - 1) return 'follicular';
  return 'luteal';
}

export interface PredictInput {
  lastPeriodDate: string | null;
  cycleLength: number;
  periodLength: number;
}

export function predict(input: PredictInput, onDate = todayISO()) {
  const { lastPeriodDate, cycleLength, periodLength } = input;
  if (!lastPeriodDate) {
    return { phase: null, dayOfCycle: null, nextPeriodStart: null, daysUntilNextPeriod: null, upcoming: [] };
  }
  const elapsed = daysBetween(lastPeriodDate, onDate);
  const dayOfCycle = (((elapsed % cycleLength) + cycleLength) % cycleLength) + 1;
  const phase = phaseForDay(dayOfCycle, cycleLength, periodLength);

  const cyclesAhead = Math.floor(elapsed / cycleLength) + 1;
  const nextPeriodStart = addDays(lastPeriodDate, cyclesAhead * cycleLength);
  const daysUntilNextPeriod = daysBetween(onDate, nextPeriodStart);

  const upcoming = Array.from({ length: 3 }, (_, i) =>
    addDays(nextPeriodStart, i * cycleLength),
  );

  return { phase, dayOfCycle, nextPeriodStart, daysUntilNextPeriod, upcoming };
}

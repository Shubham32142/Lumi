// Small dependency-free date helpers. All "ISO date" values are local calendar
// dates in YYYY-MM-DD form (no time component, no timezone surprises).

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Format a Date as a local YYYY-MM-DD string. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Parse a YYYY-MM-DD string into a local-midnight Date. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Whole days from `a` to `b` (b - a). Negative if b is before a. */
export function daysBetween(a: string, b: string): number {
  const da = parseISODate(a).getTime();
  const db = parseISODate(b).getTime();
  return Math.round((db - da) / MS_PER_DAY);
}

/** "Jun 28" */
export function formatShort(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "Jun 28, 2026" */
export function formatLong(iso: string): string {
  const d = parseISODate(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Saturday" */
export function weekdayLong(iso: string): string {
  const names = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ];
  return names[parseISODate(iso).getDay()];
}

export function monthLabel(year: number, monthIndex: number): string {
  const full = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${full[monthIndex]} ${year}`;
}

export { WEEKDAYS };

/**
 * A 6-row calendar grid (always 42 cells) for the given month. Cells outside the
 * target month are included so the grid stays rectangular; `inMonth` flags them.
 */
export function monthGrid(
  year: number,
  monthIndex: number,
): { iso: string; day: number; inMonth: boolean }[] {
  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay(); // 0 = Sunday
  const gridStart = new Date(year, monthIndex, 1 - startOffset);
  const cells: { iso: string; day: number; inMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + i,
    );
    cells.push({
      iso: toISODate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === monthIndex,
    });
  }
  return cells;
}

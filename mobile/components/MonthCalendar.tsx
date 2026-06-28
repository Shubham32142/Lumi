// Reusable month grid. Used for date-picking (onboarding) and the cycle calendar.
// Flat + calm: the number stays neutral; a small marker UNDER it shows period days
// (filled dot = logged, ring = predicted) and a faint dot = a day you logged.
// No per-day color fills ("rainbow") — the calendar reads as a calendar.
import { Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { monthGrid, monthLabel, todayISO, WEEKDAYS } from '@/lib/date';
import { AppText } from '@/components/ui';

export interface DayMeta {
  /** A period day: `confirmed` (you logged it) or `predicted` (estimate). */
  period?: 'confirmed' | 'predicted';
  /** You saved a check-in on this day (shows a faint dot when not a period day). */
  logged?: boolean;
}

export interface Cursor {
  year: number;
  monthIndex: number;
}

interface MonthCalendarProps {
  cursor: Cursor;
  onCursorChange: (next: Cursor) => void;
  selected?: string | null;
  onSelectDay?: (iso: string) => void;
  dayMeta?: (iso: string) => DayMeta | undefined;
  /** Block selecting days after today (e.g. last-period picker). */
  disableFuture?: boolean;
}

function shiftMonth({ year, monthIndex }: Cursor, delta: number): Cursor {
  const m = monthIndex + delta;
  return { year: year + Math.floor(m / 12), monthIndex: ((m % 12) + 12) % 12 };
}

function Marker({ meta }: { meta?: DayMeta }) {
  const theme = useTheme();
  const ROSE = theme.color.primary.base;
  // Reserve a fixed slot so numbers stay vertically aligned across the grid.
  let dot = null;
  if (meta?.period === 'confirmed') {
    dot = <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: ROSE }} />;
  } else if (meta?.period === 'predicted') {
    dot = (
      <View
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: ROSE,
          backgroundColor: 'transparent',
        }}
      />
    );
  } else if (meta?.logged) {
    dot = (
      <View
        style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: theme.color.text.secondary }}
      />
    );
  }
  return <View style={{ height: 9, alignItems: 'center', justifyContent: 'center' }}>{dot}</View>;
}

export function MonthCalendar({
  cursor,
  onCursorChange,
  selected,
  onSelectDay,
  dayMeta,
  disableFuture = false,
}: MonthCalendarProps) {
  const theme = useTheme();
  const today = todayISO();
  const cells = monthGrid(cursor.year, cursor.monthIndex);

  return (
    <View>
      {/* Month header */}
      <View className="flex-row items-center justify-between" style={{ marginBottom: theme.space[3] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => onCursorChange(shiftMonth(cursor, -1))}
          className="rounded-md border border-line-input p-2 active:bg-hover"
        >
          <ChevronLeft size={theme.size.iconMd} color={theme.color.text.label} />
        </Pressable>
        <AppText variant="h3">{monthLabel(cursor.year, cursor.monthIndex)}</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => onCursorChange(shiftMonth(cursor, 1))}
          className="rounded-md border border-line-input p-2 active:bg-hover"
        >
          <ChevronRight size={theme.size.iconMd} color={theme.color.text.label} />
        </Pressable>
      </View>

      {/* Weekday header */}
      <View className="flex-row">
        {WEEKDAYS.map((w) => (
          <View key={w} className="items-center" style={{ width: `${100 / 7}%` }}>
            <AppText variant="caption">{w}</AppText>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="flex-row flex-wrap" style={{ marginTop: theme.space[1] }}>
        {cells.map((cell) => {
          const meta = dayMeta?.(cell.iso);
          const isToday = cell.iso === today;
          const isSelected = selected === cell.iso;
          const isFuture = disableFuture && cell.iso > today;
          const disabled = !cell.inMonth || isFuture;

          const numberColor = isSelected
            ? theme.color.text.onPrimary
            : disabled
              ? theme.color.text.secondary
              : isToday
                ? theme.color.primary.base
                : theme.color.text.primary;

          return (
            <View key={cell.iso} className="p-1" style={{ width: `${100 / 7}%` }}>
              <Pressable
                disabled={disabled || !onSelectDay}
                onPress={() => onSelectDay?.(cell.iso)}
                accessibilityRole="button"
                accessibilityLabel={cell.iso}
                style={{ aspectRatio: 1, alignItems: 'center', justifyContent: 'center', gap: 2 }}
              >
                {/* Number — neutral text; a filled circle only for an explicit selection,
                    a ring for today. The period state lives in the marker below. */}
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? theme.color.primary.base : 'transparent',
                    borderWidth: isToday && !isSelected ? 1.5 : 0,
                    borderColor: theme.color.primary.base,
                  }}
                >
                  <AppText
                    variant="bodySm"
                    style={{ color: numberColor, opacity: cell.inMonth ? 1 : 0.4 }}
                  >
                    {cell.day}
                  </AppText>
                </View>
                {cell.inMonth ? <Marker meta={meta} /> : <View style={{ height: 9 }} />}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

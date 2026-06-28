// Reusable month grid. Used for date-picking (onboarding) and phase display
// (Calendar screen). Flat: soft solid fills + a small accent dot, no shadows.
import { Pressable, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { theme } from '@/theme';
import { monthGrid, monthLabel, todayISO, WEEKDAYS } from '@/lib/date';
import { AppText } from '@/components/ui';

export interface DayMeta {
  soft?: string; // solid tinted background
  accent?: string; // text + dot color
  dot?: boolean; // show the accent dot (e.g. predicted period)
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

export function MonthCalendar({
  cursor,
  onCursorChange,
  selected,
  onSelectDay,
  dayMeta,
  disableFuture = false,
}: MonthCalendarProps) {
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

          return (
            <View key={cell.iso} className="p-1" style={{ width: `${100 / 7}%` }}>
              <Pressable
                disabled={disabled || !onSelectDay}
                onPress={() => onSelectDay?.(cell.iso)}
                accessibilityRole="button"
                accessibilityLabel={cell.iso}
                className={`items-center justify-center rounded-md ${
                  isSelected ? 'bg-primary' : isToday ? 'border border-primary' : ''
                }`}
                style={{
                  aspectRatio: 1,
                  backgroundColor: isSelected
                    ? theme.color.primary.base
                    : meta?.soft ?? 'transparent',
                }}
              >
                <AppText
                  variant="bodySm"
                  style={{
                    color: isSelected
                      ? theme.color.text.onPrimary
                      : disabled
                        ? theme.color.text.secondary
                        : meta?.accent ?? theme.color.text.primary,
                    opacity: cell.inMonth ? 1 : 0.4,
                  }}
                >
                  {cell.day}
                </AppText>
                {meta?.dot && !isSelected ? (
                  <View
                    className="rounded-full"
                    style={{ width: 5, height: 5, backgroundColor: meta.accent }}
                  />
                ) : null}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

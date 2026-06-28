import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Droplet } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import { isPredictedPeriodDay, upcomingPeriodStarts } from '@/lib/cycle';
import { daysBetween, formatShort, todayISO } from '@/lib/date';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { MonthCalendar, type Cursor, type DayMeta } from '@/components/MonthCalendar';
import { CycleTimeline } from '@/components/CycleTimeline';

export default function Calendar() {
  const theme = useTheme();
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const periodStarts = useStore((s) => s.periodStarts);
  const logPeriodStart = useStore((s) => s.logPeriodStart);
  const removePeriodStart = useStore((s) => s.removePeriodStart);

  const now = new Date();
  const [cursor, setCursor] = useState<Cursor>({ year: now.getFullYear(), monthIndex: now.getMonth() });
  const [editing, setEditing] = useState(false);

  const today = todayISO();
  const hasAnchor = Boolean(profile.lastPeriodDate);

  // A day is "confirmed" period if it falls inside a logged period start's window.
  function confirmedStartFor(iso: string): string | null {
    for (const start of periodStarts) {
      if (iso >= start && daysBetween(start, iso) < profile.periodLength) return start;
    }
    return null;
  }

  function dayMeta(iso: string): DayMeta | undefined {
    if (confirmedStartFor(iso)) return { period: 'confirmed' };
    if (iso > today && isPredictedPeriodDay(profile, iso)) return { period: 'predicted' };
    if (logs[iso]) return { logged: true };
    return undefined;
  }

  function onSelectDay(iso: string) {
    if (!editing) {
      router.push(`/log?date=${iso}`);
      return;
    }
    // Edit mode: tap to mark/unmark a period. Marking auto-fills the whole window.
    const start = confirmedStartFor(iso);
    if (start) {
      removePeriodStart(start);
      toast.info('Period removed');
    } else {
      logPeriodStart(iso);
      toast.success(`Period set from ${formatShort(iso)}.`);
    }
  }

  const upcoming = upcomingPeriodStarts(profile, 3);

  return (
    <Screen contentBottom={theme.space[4]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <AppText variant="h1">Your cycle</AppText>

        <Card>
          <MonthCalendar
            cursor={cursor}
            onCursorChange={setCursor}
            dayMeta={dayMeta}
            onSelectDay={onSelectDay}
            disableFuture={editing}
          />

          {/* Legend */}
          <View
            className="flex-row flex-wrap"
            style={{ gap: theme.space[3], marginTop: theme.space[3] }}
          >
            <Legend kind="confirmed" label="Period" />
            <Legend kind="predicted" label="Predicted" />
            <Legend kind="logged" label="You logged" />
          </View>
        </Card>

        {/* Edit period dates (Flo-style) */}
        {editing ? (
          <Card>
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">Editing period dates</AppText>
              <AppText variant="secondary">
                Tap the day your period started. We'll fill in the next {profile.periodLength} days.
                Tap a period day again to remove it.
              </AppText>
              <Button title="Done" onPress={() => setEditing(false)} />
            </View>
          </Card>
        ) : (
          <Button title="Edit period dates" variant="secondary" onPress={() => setEditing(true)} />
        )}

        {/* Where am I in my cycle? */}
        {hasAnchor ? (
          <View style={{ gap: theme.space[3] }}>
            <AppText variant="h2">Where you are now</AppText>
            <CycleTimeline profile={profile} />
          </View>
        ) : (
          <Card>
            <AppText variant="secondary">
              Tap “Edit period dates” and mark when your last period began. Your phases and
              predictions will show up here.
            </AppText>
          </Card>
        )}

        {/* Predictions */}
        {hasAnchor ? (
          <Card>
            <AppText variant="label" style={{ marginBottom: theme.space[2] }}>
              Next predicted periods
            </AppText>
            <View style={{ gap: theme.space[2] }}>
              {upcoming.map((iso) => (
                <View key={iso} className="flex-row items-center" style={{ gap: theme.space[2] }}>
                  <Droplet size={theme.size.iconSm} color={theme.color.phase.flow.base} />
                  <AppText variant="body">{formatShort(iso)}</AppText>
                </View>
              ))}
            </View>
            {profile.isIrregular ? (
              <AppText variant="caption" style={{ marginTop: theme.space[2] }}>
                These are gentle estimates. Irregular cycles wander, and that's okay.
              </AppText>
            ) : null}
          </Card>
        ) : null}
      </View>
    </Screen>
  );
}

function Legend({ kind, label }: { kind: 'confirmed' | 'predicted' | 'logged'; label: string }) {
  const theme = useTheme();
  const rose = theme.color.primary.base;
  const dot =
    kind === 'confirmed' ? (
      <View style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: rose }} />
    ) : kind === 'predicted' ? (
      <View
        style={{ width: 9, height: 9, borderRadius: 999, borderWidth: 1.5, borderColor: rose }}
      />
    ) : (
      <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: theme.color.text.secondary }} />
    );
  return (
    <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
      {dot}
      <AppText variant="caption">{label}</AppText>
    </View>
  );
}

import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';
import { PHASE_ORDER, phaseMeta } from '@/theme/phases';
import { phaseInfoFor, upcomingPeriodStarts } from '@/lib/cycle';
import { formatShort } from '@/lib/date';
import { AppText, Card, Screen } from '@/components/ui';
import { MonthCalendar, type Cursor, type DayMeta } from '@/components/MonthCalendar';

export default function Calendar() {
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const now = new Date();
  const [cursor, setCursor] = useState<Cursor>({ year: now.getFullYear(), monthIndex: now.getMonth() });

  const hasAnchor = Boolean(profile.lastPeriodDate);

  function dayMeta(iso: string): DayMeta | undefined {
    const info = phaseInfoFor(profile, iso);
    if (!info) return logs[iso] ? { dot: true, accent: theme.color.primary.base } : undefined;
    const meta = phaseMeta(info.phase);
    return { soft: meta.soft, accent: meta.accent, dot: Boolean(logs[iso]) };
  }

  const upcoming = upcomingPeriodStarts(profile, 3);

  return (
    <Screen>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <AppText variant="h1">Your cycle calendar</AppText>

        <Card>
          <MonthCalendar
            cursor={cursor}
            onCursorChange={setCursor}
            dayMeta={dayMeta}
            onSelectDay={(iso) => router.push(`/log?date=${iso}`)}
          />
        </Card>

        {/* Legend */}
        <Card>
          <AppText variant="label" style={{ marginBottom: theme.space[2] }}>Phases</AppText>
          <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
            {PHASE_ORDER.map((p) => {
              const m = phaseMeta(p);
              return (
                <View key={p} className="flex-row items-center" style={{ gap: theme.space[1] }}>
                  <View
                    className="rounded-sm border"
                    style={{ width: 14, height: 14, backgroundColor: m.soft, borderColor: m.accent }}
                  />
                  <AppText variant="caption">{m.emoji} {m.name}</AppText>
                </View>
              );
            })}
            <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
              <View className="rounded-full bg-primary" style={{ width: 6, height: 6 }} />
              <AppText variant="caption">• logged day</AppText>
            </View>
          </View>
        </Card>

        {hasAnchor ? (
          <Card>
            <AppText variant="label" style={{ marginBottom: theme.space[2] }}>Next predicted periods</AppText>
            <View style={{ gap: theme.space[1] }}>
              {upcoming.map((iso) => (
                <AppText key={iso} variant="body">🩸 {formatShort(iso)}</AppText>
              ))}
            </View>
            {profile.isIrregular ? (
              <AppText variant="caption" style={{ marginTop: theme.space[2] }}>
                These are gentle estimates — irregular cycles wander, and that's okay.
              </AppText>
            ) : null}
          </Card>
        ) : (
          <Card>
            <AppText variant="secondary">
              Log a period start (from Today or Settings) to see your phases mapped here.
            </AppText>
          </Card>
        )}

        <AppText variant="caption">Tap any day to log or edit how you felt.</AppText>
      </View>
    </Screen>
  );
}

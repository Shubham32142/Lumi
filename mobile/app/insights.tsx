import { useMemo } from 'react';
import { View } from 'react-native';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';
import { dayOfCycle } from '@/lib/cycle';
import { SYMPTOM_CONFIG } from '@/lib/symptoms';
import { AppText, Card, FadeIn, Screen } from '@/components/ui';

const TOUGH_MOODS = ['anxious', 'irritable', 'sad'];

function labelFor(group: 'mood' | 'energy', value: string): string {
  return SYMPTOM_CONFIG[group].options.find((o) => o.value === value)?.label ?? value;
}

export default function Insights() {
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);

  const data = useMemo(() => {
    const arr = Object.values(logs);
    const moodCounts: Record<string, number> = {};
    const energyCounts: Record<string, number> = {};
    const toughDays: number[] = [];

    for (const log of arr) {
      if (log.mood) moodCounts[log.mood] = (moodCounts[log.mood] ?? 0) + 1;
      if (log.energy) energyCounts[log.energy] = (energyCounts[log.energy] ?? 0) + 1;

      const tough =
        (log.mood && TOUGH_MOODS.includes(log.mood)) ||
        (log.pain && log.pain.length > 0) ||
        log.bloating === 'bad';
      if (tough) {
        const d = dayOfCycle(profile, log.date);
        if (d != null) toughDays.push(d);
      }
    }

    const avgToughDay = toughDays.length
      ? Math.round(toughDays.reduce((a, b) => a + b, 0) / toughDays.length)
      : null;

    return { total: arr.length, moodCounts, energyCounts, avgToughDay };
  }, [logs, profile]);

  if (data.total < 3) {
    return (
      <Screen>
        <View style={{ paddingTop: theme.space[2], gap: theme.space[3] }}>
          <AppText variant="h1">Insights</AppText>
          <Card roomy>
            <AppText variant="body">
              Log a few more days and your patterns will start showing up here. You'll see which
              moods cluster, your typical energy, and when your tough days tend to land.
            </AppText>
          </Card>
          <AppText variant="secondary">{data.total} of 3 days logged so far.</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <AppText variant="h1">Insights 📈</AppText>

        {data.avgToughDay != null ? (
          <FadeIn delay={60}>
            <Card roomy>
              <AppText variant="label">Your pattern</AppText>
              <AppText variant="h2" style={{ marginTop: theme.space[1] }}>
                Tough days tend to hit around day {data.avgToughDay}
              </AppText>
              <AppText variant="secondary" style={{ marginTop: theme.space[1] }}>
                That's from the days you logged low moods, pain, or bad bloating. Knowing it
                lets you plan a softer week.
              </AppText>
            </Card>
          </FadeIn>
        ) : null}

        <FadeIn delay={120}>
          <DistroCard title="Mood" counts={data.moodCounts} group="mood" total={data.total} />
        </FadeIn>
        <FadeIn delay={180}>
          <DistroCard title="Energy" counts={data.energyCounts} group="energy" total={data.total} />
        </FadeIn>

        <AppText variant="caption">Based on {data.total} logged days. The more you log, the clearer this gets.</AppText>
      </View>
    </Screen>
  );
}

function DistroCard({
  title,
  counts,
  group,
  total,
}: {
  title: string;
  counts: Record<string, number>;
  group: 'mood' | 'energy';
  total: number;
}) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  const max = Math.max(...entries.map(([, c]) => c));

  return (
    <Card>
      <AppText variant="label" style={{ marginBottom: theme.space[3] }}>{title}</AppText>
      <View style={{ gap: theme.space[2] }}>
        {entries.map(([value, count]) => (
          <View key={value} style={{ gap: theme.space[1] }}>
            <View className="flex-row justify-between">
              <AppText variant="bodySm">{labelFor(group, value)}</AppText>
              <AppText variant="caption">{Math.round((count / total) * 100)}%</AppText>
            </View>
            {/* Flat bar: track + filled portion, both solid token colors */}
            <View className="rounded-sm bg-neutral-100" style={{ height: 8 }}>
              <View
                className="rounded-sm bg-primary"
                style={{ height: 8, width: `${(count / max) * 100}%` }}
              />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

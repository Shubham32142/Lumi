import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Settings as SettingsIcon, Sparkles } from 'lucide-react-native';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';
import type { Phase } from '@/lib/types';
import { phaseMeta } from '@/theme/phases';
import {
  daysUntilNextPeriod,
  nextPeriodStart,
  phaseInfoFor,
} from '@/lib/cycle';
import { formatShort, todayISO } from '@/lib/date';
import { PHASE_WHY } from '@/content/education';
import { AppText, Button, Card, FadeIn, Screen, Tag } from '@/components/ui';
import { PhaseBadge } from '@/components/PhaseBadge';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Today() {
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const currentStreak = useStore((s) => s.currentStreak);
  const logPeriodStart = useStore((s) => s.logPeriodStart);

  const today = todayISO();
  const info = phaseInfoFor(profile);
  const daysUntil = daysUntilNextPeriod(profile);
  const next = nextPeriodStart(profile);
  const streak = currentStreak();
  const loggedToday = Boolean(logs[today]);

  return (
    <Screen contentBottom={theme.space[4]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        {/* Greeting + streak */}
        <View style={{ gap: theme.space[1] }}>
          <View className="flex-row items-start justify-between">
            <AppText variant="secondary">{greeting()} 🌙</AppText>
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="rounded-md p-1 active:bg-hover"
            >
              <SettingsIcon size={theme.size.iconLg} color={theme.color.text.secondary} />
            </Pressable>
          </View>
          <AppText variant="h1">Here's your day</AppText>
          {streak > 0 ? (
            <View className="flex-row items-center" style={{ gap: theme.space[1], marginTop: theme.space[1] }}>
              <Sparkles size={theme.size.iconSm} color={theme.color.primary.base} />
              <AppText variant="bodySm" className="text-ink-label">
                {streak}-day logging streak — your body thanks you 🎉
              </AppText>
            </View>
          ) : null}
        </View>

        <FadeIn delay={60}>
          {info ? (
            <PhaseCard phase={info.phase} dayOfCycle={info.dayOfCycle} />
          ) : (
            <Card roomy>
              <View style={{ gap: theme.space[3] }}>
                <AppText variant="h3">Let's start your cycle 🌸</AppText>
                <AppText variant="secondary">
                  Tell us when your last period began and we'll map out your phases.
                </AppText>
                <Button title="My period started today" onPress={() => logPeriodStart(today)} />
                <Button
                  title="Pick a different date"
                  variant="secondary"
                  onPress={() => router.push('/settings')}
                />
              </View>
            </Card>
          )}
        </FadeIn>

        {/* Next period countdown */}
        {daysUntil != null && next ? (
          <FadeIn delay={120}>
          <Card>
            <View className="flex-row items-center justify-between">
              <View style={{ gap: theme.space[1] }}>
                <AppText variant="label">Next period</AppText>
                <AppText variant="h2">
                  {daysUntil === 0
                    ? 'Possibly today 🩸'
                    : daysUntil === 1
                      ? 'Tomorrow'
                      : `In ${daysUntil} days`}
                </AppText>
                <AppText variant="secondary">
                  Predicted {formatShort(next)}
                  {profile.isIrregular ? ' · estimate' : ''}
                </AppText>
              </View>
              <Tag label={`${profile.cycleLength}-day cycle`} />
            </View>
          </Card>
          </FadeIn>
        ) : null}

        {/* Quick actions */}
        <FadeIn delay={180}>
          <View style={{ gap: theme.space[2] }}>
            <Button
              title={loggedToday ? 'Edit today’s check-in' : 'Log how you feel today'}
              onPress={() => router.push('/log')}
            />
            <Button
              title="Talk to Luna 🌙"
              variant="secondary"
              onPress={() => router.push('/luna')}
            />
          </View>
        </FadeIn>

        {/* Insights shortcut */}
        <FadeIn delay={240}>
        <Card>
          <View className="flex-row items-center justify-between">
            <View style={{ gap: theme.space[1], flex: 1 }}>
              <AppText variant="title">Your patterns</AppText>
              <AppText variant="secondary">See when symptoms usually hit across your cycle.</AppText>
            </View>
            <Button
              title="Insights"
              variant="secondary"
              fullWidth={false}
              onPress={() => router.push('/insights')}
              icon={<ChevronRight size={theme.size.iconSm} color={theme.color.text.label} />}
            />
          </View>
        </Card>
        </FadeIn>
      </View>
    </Screen>
  );
}

function PhaseCard({ phase, dayOfCycle }: { phase: Phase; dayOfCycle: number }) {
  const meta = phaseMeta(phase);
  const why = PHASE_WHY[phase][0];
  return (
    <Card roomy>
      <View style={{ gap: theme.space[3] }}>
        <PhaseBadge phase={phase} dayOfCycle={dayOfCycle} />
        <AppText variant="h3">{meta.tagline}</AppText>
        <View
          className="rounded-md border p-3"
          style={{ backgroundColor: meta.soft, borderColor: meta.accent }}
        >
          <AppText variant="caption" style={{ color: meta.accent }} className="font-medium">
            WHY YOU MIGHT FEEL THIS
          </AppText>
          <AppText variant="bodySm" className="text-ink" style={{ marginTop: theme.space[1] }}>
            {why}
          </AppText>
        </View>
        <Button
          title="Learn more about this phase"
          variant="secondary"
          onPress={() => router.push('/learn')}
        />
      </View>
    </Card>
  );
}

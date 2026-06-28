import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, Settings as SettingsIcon } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import { phaseColors, phaseMeta } from '@/theme/phases';
import { nextPeriodStart, phaseInfoFor } from '@/lib/cycle';
import { formatShort, todayISO } from '@/lib/date';
import { AppText, Button, Card, FadeIn, Screen } from '@/components/ui';
import { CycleRing } from '@/components/CycleRing';
import { Aura } from '@/components/Aura';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Today() {
  const theme = useTheme();
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const logPeriodStart = useStore((s) => s.logPeriodStart);

  const today = todayISO();
  const info = phaseInfoFor(profile);
  const loggedToday = Boolean(logs[today]);
  const next = info ? nextPeriodStart(profile) : null;
  const meta = info ? phaseMeta(info.phase) : null;

  return (
    <Screen contentBottom={theme.space[4]}>
      <View style={{ paddingTop: theme.space[1], gap: theme.space[4] }}>
        {/* Top bar */}
        <View className="flex-row items-center justify-between">
          <AppText variant="secondary">{greeting()}</AppText>
          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            className="rounded-md p-1 active:bg-hover"
          >
            <SettingsIcon size={theme.size.iconLg} color={theme.color.text.secondary} />
          </Pressable>
        </View>

        {info && meta ? (
          <>
            <FadeIn delay={40}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: theme.space[2],
                }}
              >
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Aura
                    color={phaseColors(theme.color, info.phase).accent}
                    size={460}
                    intensity={theme.isDark ? 0.55 : 0.42}
                  />
                </View>
                <CycleRing profile={profile} />
              </View>
            </FadeIn>

            {next ? (
              <AppText variant="caption" style={{ textAlign: 'center' }}>
                Period likely around {formatShort(next)}. {profile.cycleLength}-day cycle.
              </AppText>
            ) : null}

            <FadeIn delay={120}>
              <Button
                title={loggedToday ? "Edit today's check-in" : 'Log how today feels'}
                onPress={() => router.push('/log')}
              />
            </FadeIn>

            <FadeIn delay={180}>
              <View style={{ gap: theme.space[2] }}>
                <Row
                  title={`${meta.name}. Here's why you feel it`}
                  onPress={() => router.push('/learn')}
                />
                <Row title="See your patterns" onPress={() => router.push('/insights')} />
              </View>
            </FadeIn>
          </>
        ) : (
          <FadeIn delay={40}>
            <Card roomy>
              <View style={{ gap: theme.space[3] }}>
                <AppText variant="h2">Let's find your rhythm</AppText>
                <AppText variant="secondary">
                  Tell us when your last period began and your phases and predictions show up here.
                </AppText>
                <Button
                  title="My period started today"
                  onPress={() => {
                    logPeriodStart(today);
                    toast.success('Got it. Rest up today.');
                  }}
                />
                <Button
                  title="Pick a different date"
                  variant="secondary"
                  onPress={() => router.push('/settings')}
                />
              </View>
            </Card>
          </FadeIn>
        )}
      </View>
    </Screen>
  );
}

function Row({ title, onPress }: { title: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center justify-between rounded-lg border border-line bg-page active:bg-hover"
      style={{ paddingVertical: theme.space[3], paddingHorizontal: theme.space[4] }}
    >
      <AppText variant="body" className="flex-1">
        {title}
      </AppText>
      <ChevronRight size={theme.size.iconSm} color={theme.color.text.secondary} />
    </Pressable>
  );
}

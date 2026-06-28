// The supporter experience. Two modes share this screen:
//  - SUPPORTER (logged in with a partner code): reads her shared snapshot from
//    the cloud and teaches them how to show up.
//  - PREVIEW (the owner, from Settings): shows the same thing from local data,
//    so she sees exactly what her partner sees.
// It does more than "be nice": what's happening, how to help today, what to
// avoid, and why understanding this helps them both.
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Heart, Settings as SettingsIcon } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import type { Phase } from '@/lib/types';
import { phaseColors, phaseMeta } from '@/theme/phases';
import { daysUntilNextPeriod, phaseInfoFor } from '@/lib/cycle';
import { todayISO } from '@/lib/date';
import { PARTNER_GUIDE } from '@/content/partner';
import { SYMPTOM_CONFIG } from '@/lib/symptoms';
import { AppText, Button, Card, Screen, Tag } from '@/components/ui';

function optLabel(group: 'mood' | 'energy', value: string | null): string | null {
  if (!value) return null;
  return SYMPTOM_CONFIG[group].options.find((o) => o.value === value)?.label ?? value;
}

export default function Partner() {
  const theme = useTheme();
  const supporterCode = useStore((s) => s.supporterCode);
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const snapshot = useStore((s) => s.partnerSnapshot);
  const refreshPartner = useStore((s) => s.refreshPartner);

  const isSupporter = Boolean(supporterCode);

  useEffect(() => {
    if (isSupporter) void refreshPartner();
  }, [isSupporter, refreshPartner]);

  // Resolve the state depending on mode.
  const info = !isSupporter ? phaseInfoFor(profile) : null;
  const sharing = profile.partnerSharing;

  const phase: Phase | null = isSupporter
    ? snapshot?.enabled
      ? ((snapshot.phase as Phase) ?? null)
      : null
    : info?.phase ?? null;

  const mood = isSupporter
    ? snapshot?.today?.mood ?? null
    : sharing.shareMood
      ? logs[todayISO()]?.mood ?? null
      : null;
  const energy = isSupporter
    ? snapshot?.today?.energy ?? null
    : sharing.shareEnergy
      ? logs[todayISO()]?.energy ?? null
      : null;
  const daysUntil = isSupporter
    ? snapshot?.daysUntilNextPeriod ?? null
    : info
      ? daysUntilNextPeriod(profile)
      : null;

  const notLoaded = isSupporter && (!snapshot || !snapshot.linked);
  const sharingPaused = isSupporter && Boolean(snapshot?.linked) && snapshot?.enabled === false;

  const guide = phase ? PARTNER_GUIDE[phase] : null;
  const meta = phase ? phaseMeta(phase) : null;
  const colors = phase ? phaseColors(theme.color, phase) : null;
  const PhaseIcon = meta?.icon;

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <View className="flex-row items-start justify-between">
          <View style={{ gap: theme.space[1], flex: 1 }}>
            <AppText variant="secondary">
              {isSupporter ? 'You are supporting' : 'What your partner sees'}
            </AppText>
            <AppText variant="h1">Today, at a glance</AppText>
          </View>
          {isSupporter ? (
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
              className="rounded-md p-1 active:bg-hover"
            >
              <SettingsIcon size={theme.size.iconLg} color={theme.color.text.secondary} />
            </Pressable>
          ) : null}
        </View>

        {notLoaded ? (
          <Card>
            <View style={{ gap: theme.space[3] }}>
              <AppText variant="body">We couldn't load their cycle right now.</AppText>
              <Button title="Try again" variant="secondary" onPress={() => void refreshPartner()} />
            </View>
          </Card>
        ) : sharingPaused ? (
          <Card>
            <AppText variant="secondary">
              They've paused sharing for now. You'll see updates when they turn it back on.
            </AppText>
          </Card>
        ) : !phase || !guide || !meta || !colors ? (
          <Card>
            <AppText variant="secondary">
              No cycle data shared yet. Once they log a period start, their phase shows here.
            </AppText>
          </Card>
        ) : (
          <>
            {/* Where she is now */}
            <Card roomy>
              <View style={{ gap: theme.space[3] }}>
                <View
                  className="flex-row items-center self-start rounded-md border px-3 py-2"
                  style={{ backgroundColor: colors.soft, borderColor: colors.accent, gap: theme.space[2] }}
                >
                  {PhaseIcon ? <PhaseIcon size={theme.size.iconMd} color={colors.accent} /> : null}
                  <AppText variant="title" style={{ color: colors.accent }}>
                    {meta.name}
                  </AppText>
                </View>
                {daysUntil != null ? (
                  <AppText variant="secondary">
                    {daysUntil <= 0
                      ? 'Her period may start any day now.'
                      : `About ${daysUntil} days until her period.`}
                  </AppText>
                ) : null}
                {mood || energy ? (
                  <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
                    {mood ? <Tag label={`Mood: ${optLabel('mood', mood)}`} /> : null}
                    {energy ? <Tag label={`Energy: ${optLabel('energy', energy)}`} /> : null}
                  </View>
                ) : null}
              </View>
            </Card>

            <GuideCard title="What's happening">
              <AppText variant="body">{guide.whatsHappening}</AppText>
            </GuideCard>

            <GuideCard title="How to show up today">
              <View style={{ gap: theme.space[3] }}>
                {guide.support.map((a, i) => (
                  <View key={i} className="flex-row items-start" style={{ gap: theme.space[3] }}>
                    <View
                      style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: colors.accent, marginTop: 7 }}
                    />
                    <View style={{ flex: 1 }}>
                      <AppText
                        variant="bodySm"
                        style={{ color: theme.color.text.primary, fontFamily: theme.font.family.sansSemibold }}
                      >
                        {a.text}
                      </AppText>
                      {a.detail ? <AppText variant="secondary">{a.detail}</AppText> : null}
                    </View>
                  </View>
                ))}
              </View>
            </GuideCard>

            <GuideCard title="What not to do">
              <View style={{ gap: theme.space[2] }}>
                {guide.avoid.map((t, i) => (
                  <AppText key={i} variant="body">
                    • {t}
                  </AppText>
                ))}
              </View>
            </GuideCard>

            <View className="rounded-lg" style={{ backgroundColor: colors.soft, padding: theme.space[4] }}>
              <AppText variant="label" style={{ color: colors.accent, marginBottom: theme.space[1] }}>
                WHY THIS HELPS YOU BOTH
              </AppText>
              <AppText variant="body" className="text-ink">
                {guide.relationship}
              </AppText>
            </View>

            <Button
              title="Send love"
              icon={<Heart size={theme.size.iconSm} color={theme.color.text.onPrimary} />}
              onPress={() => toast.success('Sent. They will feel the love.')}
            />

            <AppText variant="caption">
              {isSupporter
                ? 'You only see what they choose to share.'
                : 'Partners only see what you switch on in Settings.'}
            </AppText>
          </>
        )}
      </View>
    </Screen>
  );
}

function GuideCard({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Card>
      <View style={{ gap: theme.space[2] }}>
        <AppText variant="label">{title}</AppText>
        {children}
      </View>
    </Card>
  );
}

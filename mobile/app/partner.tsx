import { View } from 'react-native';
import { router } from 'expo-router';
import { toast } from '@/lib/toast';
import { Heart } from 'lucide-react-native';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';
import { phaseMeta } from '@/theme/phases';
import { phaseInfoFor } from '@/lib/cycle';
import { todayISO } from '@/lib/date';
import { SYMPTOM_CONFIG } from '@/lib/symptoms';
import { PARTNER_TIPS } from '@/content/partner';
import { AppText, Button, Card, Screen, Tag } from '@/components/ui';
import { PhaseBadge } from '@/components/PhaseBadge';

function optionLabel(group: 'mood' | 'energy', value: string): string {
  const opt = SYMPTOM_CONFIG[group].options.find((o) => o.value === value);
  return opt ? `${opt.emoji} ${opt.label}` : value;
}

export default function Partner() {
  const profile = useStore((s) => s.profile);
  const todayLog = useStore((s) => s.logs[todayISO()]);
  const sharing = profile.partnerSharing;

  const info = phaseInfoFor(profile);

  if (!sharing.enabled) {
    return (
      <Screen>
        <View style={{ paddingTop: theme.space[2], gap: theme.space[3] }}>
          <AppText variant="h1">Partner View</AppText>
          <Card roomy>
            <AppText variant="body">
              Partner sharing is currently off. Turn it on in Settings to share a simple,
              respectful snapshot — you choose exactly what's visible.
            </AppText>
          </Card>
          <Button title="Open sharing settings" onPress={() => router.push('/settings')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <View style={{ gap: theme.space[1] }}>
          <AppText variant="secondary">This is what your partner sees 👀</AppText>
          <AppText variant="h1">Today, at a glance</AppText>
        </View>

        {info ? (
          <Card roomy>
            <View style={{ gap: theme.space[3] }}>
              <PhaseBadge phase={info.phase} />
              <AppText variant="body">{phaseMeta(info.phase).tagline}</AppText>
            </View>
          </Card>
        ) : (
          <Card>
            <AppText variant="secondary">No cycle data shared yet.</AppText>
          </Card>
        )}

        {/* Mood & energy — only if shared */}
        {(sharing.shareMood || sharing.shareEnergy) && todayLog ? (
          <Card>
            <AppText variant="label" style={{ marginBottom: theme.space[2] }}>How she's feeling</AppText>
            <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
              {sharing.shareMood && todayLog.mood ? (
                <Tag label={optionLabel('mood', todayLog.mood)} />
              ) : null}
              {sharing.shareEnergy && todayLog.energy ? (
                <Tag label={`Energy: ${optionLabel('energy', todayLog.energy)}`} />
              ) : null}
              {!todayLog.mood && !todayLog.energy ? (
                <AppText variant="secondary">Nothing logged yet today.</AppText>
              ) : null}
            </View>
          </Card>
        ) : null}

        {/* Support tips */}
        {info ? (
          <Card roomy>
            <AppText variant="label" style={{ marginBottom: theme.space[2] }}>
              How to support her today
            </AppText>
            <View style={{ gap: theme.space[3] }}>
              {PARTNER_TIPS[info.phase].map((tip, i) => (
                <AppText key={i} variant="body">• {tip}</AppText>
              ))}
            </View>
          </Card>
        ) : null}

        <Button
          title="Send love 💕"
          icon={<Heart size={theme.size.iconSm} color={theme.color.text.onPrimary} />}
          onPress={() => toast.success('Sent 💕 — your person will feel the love')}
        />

        <AppText variant="caption">
          Partners never see symptom details, history, or your chats with Luna unless you turn
          those on. You're in control. 🔒
        </AppText>
      </View>
    </Screen>
  );
}

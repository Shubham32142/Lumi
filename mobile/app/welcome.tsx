// "Who are you here as?" — the first screen after signing in. Routes the two real
// people who open Lumi to their own job: the person tracking, or a partner who
// has a code and wants to support someone.
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, HeartHandshake, User, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import { ApiError } from '@/lib/api';
import { AppText, Button, Card, Screen } from '@/components/ui';
import { Logo } from '@/components/Logo';

export default function Welcome() {
  const theme = useTheme();
  const linkPartner = useStore((s) => s.linkPartner);
  const [step, setStep] = useState<'choose' | 'code'>('choose');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  async function joinAsSupporter() {
    if (!code.trim()) {
      toast.error('Enter the code your partner shared with you.');
      return;
    }
    setBusy(true);
    try {
      await linkPartner(code.trim());
      toast.success('Connected. Here is how to support them.');
      router.replace('/partner');
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : 'Could not connect. Check the code and your connection.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[8], gap: theme.space[6], alignItems: 'center' }}>
        <Logo size={64} />
        <View style={{ gap: theme.space[1], alignItems: 'center' }}>
          <AppText variant="h1">Who are you here as?</AppText>
          <AppText variant="secondary" style={{ textAlign: 'center' }}>
            So Lumi shows you the right thing.
          </AppText>
        </View>

        {step === 'choose' ? (
          <View style={{ gap: theme.space[3], alignSelf: 'stretch' }}>
            <ChoiceCard
              icon={User}
              title="It's my cycle"
              body="Track your cycle, understand your phases, and get gentle predictions."
              onPress={() => router.replace('/onboarding')}
            />
            <ChoiceCard
              icon={HeartHandshake}
              title="I'm supporting someone"
              body="You have a partner code. See how to show up for them this week."
              onPress={() => setStep('code')}
            />
          </View>
        ) : (
          <Card className="w-full">
            <View style={{ gap: theme.space[3] }}>
              <AppText variant="label">Partner code</AppText>
              <TextInput
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="e.g. CYC-ABC123"
                placeholderTextColor={theme.color.text.secondary}
                className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                style={{ height: theme.size.inputH }}
              />
              <Button title={busy ? 'Connecting…' : 'Continue'} disabled={busy} onPress={joinAsSupporter} />
              <Button title="Back" variant="secondary" onPress={() => setStep('choose')} />
            </View>
          </Card>
        )}
      </View>
    </Screen>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  body,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center rounded-lg border border-line bg-page active:bg-hover"
      style={{ padding: theme.space[4], gap: theme.space[3] }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: theme.radius.full,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.color.primary.light,
        }}
      >
        <Icon size={22} color={theme.color.primary.base} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="title">{title}</AppText>
        <AppText variant="secondary">{body}</AppText>
      </View>
      <ChevronRight size={theme.size.iconMd} color={theme.color.text.secondary} />
    </Pressable>
  );
}

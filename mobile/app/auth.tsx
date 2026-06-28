// Dedicated Login / Sign-up screen. Reachable from Settings and onboarding.
// Cloud backup is optional — the app is fully usable in local mode.
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { theme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import { ApiError, login, signup } from '@/lib/api';
import { AppText, Button, Card, Divider, Screen } from '@/components/ui';
import { Logo } from '@/components/Logo';

type Mode = 'signup' | 'login';

export default function Auth() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'login' ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const setSession = useStore((s) => s.setSession);
  const cloudSync = useStore((s) => s.cloudSync);

  async function submit() {
    if (!email.trim() || password.length < 8) {
      toast.error('Enter an email and a password of at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      const res =
        mode === 'signup'
          ? await signup(email.trim(), password)
          : await login(email.trim(), password);
      setSession({ token: res.token, userId: res.userId, email: email.trim() });
      cloudSync(true).catch(() => {});
      toast.success(mode === 'signup' ? 'Account created — backing up ☁️' : 'Welcome back 🎉');
      router.back();
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : 'Could not reach the server. You can keep using local mode.',
      );
    } finally {
      setBusy(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[6], gap: theme.space[6], alignItems: 'center' }}>
        <Logo size={72} />
        <View style={{ gap: theme.space[1], alignItems: 'center' }}>
          <AppText variant="h1">{isSignup ? 'Create your account' : 'Welcome back'}</AppText>
          <AppText variant="secondary" style={{ textAlign: 'center' }}>
            {isSignup
              ? 'Back up your cycle and sync across devices. Optional — Lumi works fully offline.'
              : 'Log in to restore your synced cycle data.'}
          </AppText>
        </View>

        {/* Mode switch */}
        <View
          className="flex-row rounded-full border border-line"
          style={{ padding: 3, alignSelf: 'stretch', backgroundColor: theme.color.surface.muted }}
        >
          <Segment label="Sign up" active={isSignup} onPress={() => setMode('signup')} />
          <Segment label="Log in" active={!isSignup} onPress={() => setMode('login')} />
        </View>

        <Card className="w-full">
          <View style={{ gap: theme.space[3] }}>
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">Email</AppText>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor={theme.color.text.secondary}
                className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                style={{ height: theme.size.inputH }}
              />
            </View>
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">Password</AppText>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                placeholder="At least 8 characters"
                placeholderTextColor={theme.color.text.secondary}
                className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                style={{ height: theme.size.inputH }}
              />
            </View>
            <Button
              title={busy ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
              disabled={busy}
              onPress={submit}
            />
            <Divider />
            <AppText variant="caption" style={{ textAlign: 'center' }}>
              🔒 Your AI key never leaves this device. We only sync your cycle data.
            </AppText>
          </View>
        </Card>

        <Button title="Continue without an account" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        flex: 1,
        height: 38,
        borderRadius: theme.radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? theme.color.primary.base : 'transparent',
      }}
    >
      <AppText
        variant="bodySm"
        style={{
          color: active ? theme.color.text.onPrimary : theme.color.text.label,
          fontWeight: theme.font.weight.medium as '500',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

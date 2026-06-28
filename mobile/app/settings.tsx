import { useState } from 'react';
import { Alert, Pressable, Share, Switch, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import {
  Bell,
  Bot,
  Heart,
  ListChecks,
  Minus,
  Moon,
  Plus,
  Repeat,
  ShieldCheck,
  Smartphone,
  Sun,
  SunMoon,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme, useThemeStore, type ThemeMode } from '@/theme';
import { useStore } from '@/lib/store';
import type { SymptomKey } from '@/lib/types';
import { formatLong, todayISO } from '@/lib/date';
import { SYMPTOM_CONFIG } from '@/lib/symptoms';
import { toast } from '@/lib/toast';
import { PROVIDERS, PROVIDER_OPTIONS, type ProviderId } from '@/lib/ai/providers';
import { AppText, Button, Card, ChoiceChip, Divider, Screen, Select } from '@/components/ui';

const TRACK_OPTIONS: { key: SymptomKey; title: string; emoji: string }[] = [
  ...Object.values(SYMPTOM_CONFIG).map((c) => ({ key: c.key, title: c.title, emoji: c.emoji })),
  { key: 'pain', title: 'Pain', emoji: '🤕' },
];

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
  { mode: 'system', label: 'System', icon: Smartphone },
];

function makeInviteCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `CYC-${code}`;
}

export default function Settings() {
  const theme = useTheme();
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const logPeriodStart = useStore((s) => s.logPeriodStart);
  const resetAll = useStore((s) => s.resetAll);
  const aiConfig = useStore((s) => s.aiConfig);
  const setAiConfig = useStore((s) => s.setAiConfig);
  const session = useStore((s) => s.session);
  const clearSession = useStore((s) => s.clearSession);
  const deleteAccount = useStore((s) => s.deleteAccount);
  const cloudSync = useStore((s) => s.cloudSync);
  const syncing = useStore((s) => s.syncing);
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);
  const supporterCode = useStore((s) => s.supporterCode);
  const becomeSupporter = useStore((s) => s.becomeSupporter);
  const [codeInput, setCodeInput] = useState('');

  function connectSupporter() {
    if (!codeInput.trim()) {
      toast.error('Enter the code your partner shared with you.');
      return;
    }
    becomeSupporter(codeInput.trim());
    setCodeInput('');
    toast.success('Connected. Opening their support view.');
    router.push('/partner');
  }

  function toggleTracked(key: SymptomKey) {
    const has = profile.trackedSymptoms.includes(key);
    updateProfile({
      trackedSymptoms: has
        ? profile.trackedSymptoms.filter((k) => k !== key)
        : [...profile.trackedSymptoms, key],
    });
  }

  async function exportData() {
    const s = useStore.getState();
    const payload = JSON.stringify(
      {
        profile: s.profile,
        logs: s.logs,
        periodStarts: s.periodStarts,
        bookmarks: s.bookmarks,
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    );
    try {
      await Share.share({ message: payload });
    } catch {
      toast.error("Couldn't open the share sheet on this device.");
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete everything?',
      'This permanently removes all your data from this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete all',
          style: 'destructive',
          onPress: () => {
            resetAll();
            router.replace('/onboarding');
          },
        },
      ],
    );
  }

  function logout() {
    clearSession();
    toast.info('Logged out. Your data stays on this device.');
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and all your data, both in the cloud and on this device. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              toast.success('Account deleted.');
              router.replace('/auth');
            } catch {
              toast.error('Could not delete your account. Check your connection.');
            }
          },
        },
      ],
    );
  }

  async function syncNow() {
    try {
      await cloudSync(false);
      toast.success('Synced.');
    } catch {
      toast.error('Sync failed. Check your connection.');
    }
  }

  const sharing = profile.partnerSharing;
  const notif = profile.notificationPrefs;
  const providerMeta = PROVIDERS[aiConfig.provider];

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[6] }}>
        {/* ── Luna & AI ── */}
        <Section title="Luna & AI" icon={Bot}>
          <Card>
            <View style={{ gap: theme.space[3] }}>
              <View
                className="flex-row items-center self-start"
                style={{
                  gap: theme.space[2],
                  backgroundColor: theme.color.accent.soft,
                  borderRadius: theme.radius.full,
                  paddingHorizontal: theme.space[3],
                  paddingVertical: 4,
                }}
              >
                <AppText
                  variant="caption"
                  style={{ color: theme.color.accent.base, letterSpacing: 1 }}
                >
                  BETA
                </AppText>
              </View>
              <AppText variant="caption">
                Luna is optional. Bring your own AI key to chat with her. Once a key is set, Luna
                appears in the tab bar. Your key stays on this device.
              </AppText>
              <View style={{ gap: theme.space[2] }}>
                <AppText variant="label">Provider</AppText>
                <Select
                  value={aiConfig.provider}
                  options={PROVIDER_OPTIONS}
                  onChange={(v) => {
                    const p = v as ProviderId;
                    setAiConfig({ provider: p, model: PROVIDERS[p].defaultModel });
                  }}
                />
              </View>

              <Divider />

              <View style={{ gap: theme.space[2] }}>
                <AppText variant="label">{providerMeta.keyLabel}</AppText>
                <TextInput
                  value={aiConfig.apiKey}
                  onChangeText={(t) => setAiConfig({ apiKey: t })}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={providerMeta.keyPlaceholder}
                  placeholderTextColor={theme.color.text.secondary}
                  className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                  style={{ height: theme.size.inputH }}
                />
                <AppText variant="caption">
                  Get a key at {providerMeta.keyHelp}. Stored only on this device and sent directly to{' '}
                  {providerMeta.label}. We never see it.
                </AppText>
              </View>

              <Divider />

              <View style={{ gap: theme.space[2] }}>
                <AppText variant="label">Model</AppText>
                {providerMeta.modelInput === 'dropdown' && providerMeta.models ? (
                  <Select
                    value={aiConfig.model}
                    options={providerMeta.models}
                    onChange={(v) => setAiConfig({ model: v })}
                  />
                ) : (
                  <TextInput
                    value={aiConfig.model}
                    onChangeText={(t) => setAiConfig({ model: t })}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="e.g. gpt-4o-mini"
                    placeholderTextColor={theme.color.text.secondary}
                    className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                    style={{ height: theme.size.inputH }}
                  />
                )}
              </View>
            </View>
          </Card>
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance" icon={SunMoon}>
          <Card>
            <View className="flex-row" style={{ gap: theme.space[2] }}>
              {THEME_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.mode}
                  label={o.label}
                  icon={o.icon}
                  selected={themeMode === o.mode}
                  onPress={() => setThemeMode(o.mode)}
                />
              ))}
            </View>
            <AppText variant="caption" style={{ marginTop: theme.space[2] }}>
              System follows your phone's light or dark setting.
            </AppText>
          </Card>
        </Section>

        {/* ── Cycle ── */}
        <Section title="Your cycle" icon={Repeat}>
          <Card>
            <Stepper
              label="Average cycle length"
              unit="days"
              value={profile.cycleLength}
              min={21}
              max={35}
              onChange={(n) => updateProfile({ cycleLength: n })}
            />
            <Divider />
            <Stepper
              label="Period length"
              unit="days"
              value={profile.periodLength}
              min={2}
              max={10}
              onChange={(n) => updateProfile({ periodLength: n })}
            />
            <Divider />
            <ToggleRow
              label="My cycle is irregular"
              value={profile.isIrregular}
              onChange={(v) => updateProfile({ isIrregular: v })}
            />
            <Divider />
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">Last period start</AppText>
              <AppText variant="body">
                {profile.lastPeriodDate ? formatLong(profile.lastPeriodDate) : 'Not set'}
              </AppText>
              <Button
                title="My period started today"
                variant="secondary"
                onPress={() => {
                  logPeriodStart(todayISO());
                  toast.success('Period start saved.');
                }}
              />
            </View>
          </Card>
        </Section>

        {/* ── Tracked symptoms ── */}
        <Section title="What you track" icon={ListChecks}>
          <Card>
            <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
              {TRACK_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.key}
                  label={o.title}
                  selected={profile.trackedSymptoms.includes(o.key)}
                  onPress={() => toggleTracked(o.key)}
                />
              ))}
            </View>
          </Card>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" icon={Bell}>
          <Card>
            <ToggleRow
              label="Enable notifications"
              value={notif.enabled}
              onChange={(v) => updateProfile({ notificationPrefs: { ...notif, enabled: v } })}
            />
            {notif.enabled ? (
              <>
                <Divider />
                <ToggleRow
                  label="Period reminders"
                  value={notif.periodReminders}
                  onChange={(v) => updateProfile({ notificationPrefs: { ...notif, periodReminders: v } })}
                />
                <Divider />
                <ToggleRow
                  label="Phase transition alerts"
                  value={notif.phaseTransitions}
                  onChange={(v) => updateProfile({ notificationPrefs: { ...notif, phaseTransitions: v } })}
                />
                <Divider />
                <ToggleRow
                  label="Self-care nudges"
                  value={notif.selfCareNudges}
                  onChange={(v) => updateProfile({ notificationPrefs: { ...notif, selfCareNudges: v } })}
                />
              </>
            ) : null}
          </Card>
        </Section>

        {/* ── Partner sharing ── */}
        <Section title="Partner sharing" icon={Heart}>
          <Card>
            <ToggleRow
              label="Enable partner sharing"
              value={sharing.enabled}
              onChange={(v) =>
                updateProfile({
                  partnerSharing: {
                    ...sharing,
                    enabled: v,
                    inviteCode: v && !sharing.inviteCode ? makeInviteCode() : sharing.inviteCode,
                  },
                })
              }
            />
            {sharing.enabled ? (
              <>
                <Divider />
                <View style={{ gap: theme.space[1] }}>
                  <AppText variant="label">Invite code</AppText>
                  <AppText variant="h3">{sharing.inviteCode}</AppText>
                  <AppText variant="caption">Share this with your partner to link their Support Account.</AppText>
                </View>
                <Divider />
                <AppText variant="label" style={{ marginBottom: theme.space[2] }}>What they can see</AppText>
                <ToggleRow
                  label="Mood"
                  value={sharing.shareMood}
                  onChange={(v) => updateProfile({ partnerSharing: { ...sharing, shareMood: v } })}
                />
                <Divider />
                <ToggleRow
                  label="Energy"
                  value={sharing.shareEnergy}
                  onChange={(v) => updateProfile({ partnerSharing: { ...sharing, shareEnergy: v } })}
                />
                <Divider />
                <ToggleRow
                  label="Symptom details (pain, flow, cravings)"
                  value={sharing.shareSymptoms}
                  onChange={(v) => updateProfile({ partnerSharing: { ...sharing, shareSymptoms: v } })}
                />
                <Divider />
                <Button title="Preview partner view" variant="secondary" onPress={() => router.push('/partner')} />
              </>
            ) : null}

            <Divider />
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">Have a partner's code?</AppText>
              <AppText variant="caption">
                If someone shared their Lumi code with you, enter it to see how to support them this
                week.
              </AppText>
              {supporterCode ? (
                <AppText variant="body">Connected with {supporterCode}</AppText>
              ) : null}
              <TextInput
                value={codeInput}
                onChangeText={setCodeInput}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="e.g. CYC-ABC123"
                placeholderTextColor={theme.color.text.secondary}
                className="rounded-md border border-line-input bg-page px-3 text-base text-ink"
                style={{ height: theme.size.inputH }}
              />
              <Button title="Connect" variant="secondary" onPress={connectSupporter} />
            </View>
          </Card>
        </Section>

        {/* ── Account ── */}
        <Section title="Account" icon={User}>
          <Card>
            {session ? (
              <View style={{ gap: theme.space[3] }}>
                <View style={{ gap: theme.space[1] }}>
                  <AppText variant="label">Signed in</AppText>
                  <AppText variant="body">{session.email}</AppText>
                  <AppText variant="caption">
                    {syncing
                      ? 'Syncing…'
                      : 'Your logs and settings back up to the cloud automatically. Your AI key stays on this device.'}
                  </AppText>
                </View>
                <Button
                  title={syncing ? 'Syncing…' : 'Sync now'}
                  variant="secondary"
                  disabled={syncing}
                  onPress={syncNow}
                />
                <Button title="Log out" variant="secondary" onPress={logout} />
                <Divider />
                <Button title="Delete account" variant="danger" onPress={confirmDeleteAccount} />
                <AppText variant="caption">
                  Permanently deletes your account and all your data, both in the cloud and on this
                  device. This cannot be undone.
                </AppText>
              </View>
            ) : (
              <View style={{ gap: theme.space[3] }}>
                <AppText variant="body">
                  You're in local mode. Everything lives on this device. Create an account for cloud
                  backup and sync across devices. Your AI key always stays local. (Optional.)
                </AppText>
                <Button title="Create account" onPress={() => router.push('/auth?mode=signup')} />
                <Button
                  title="Log in"
                  variant="secondary"
                  onPress={() => router.push('/auth?mode=login')}
                />
              </View>
            )}
          </Card>
        </Section>

        {/* ── Data & privacy ── */}
        <Section title="Data & privacy" icon={ShieldCheck}>
          <Card>
            <AppText variant="body">Your health data is never sold or shared. Export or delete it anytime.</AppText>
            <Divider />
            <View style={{ gap: theme.space[2] }}>
              <Button title="Export my data (JSON)" variant="secondary" onPress={exportData} />
              <Button title="Delete all my data" variant="danger" onPress={confirmDelete} />
            </View>
          </Card>
        </Section>
      </View>
    </Screen>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.space[3] }}>
      <View className="flex-row items-center" style={{ gap: theme.space[2] }}>
        <Icon size={theme.size.iconMd} color={theme.color.primary.base} />
        <AppText variant="h2">{title}</AppText>
      </View>
      {children}
    </View>
  );
}

function Stepper({
  label,
  unit,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  const theme = useTheme();
  return (
    <View className="flex-row items-center justify-between" style={{ gap: theme.space[3] }}>
      <AppText variant="body" className="flex-1">{label}</AppText>
      <View className="flex-row items-center" style={{ gap: theme.space[3] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label}`}
          disabled={value <= min}
          onPress={() => onChange(value - 1)}
          className={`rounded-md border p-2 ${value <= min ? 'border-line bg-muted' : 'border-line-input bg-page active:bg-hover'}`}
        >
          <Minus size={theme.size.iconMd} color={value <= min ? theme.color.text.secondary : theme.color.text.label} />
        </Pressable>
        <View className="items-center" style={{ minWidth: 56 }}>
          <AppText variant="h3">{value}</AppText>
          <AppText variant="caption">{unit}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label}`}
          disabled={value >= max}
          onPress={() => onChange(value + 1)}
          className={`rounded-md border p-2 ${value >= max ? 'border-line bg-muted' : 'border-line-input bg-page active:bg-hover'}`}
        >
          <Plus size={theme.size.iconMd} color={value >= max ? theme.color.text.secondary : theme.color.text.label} />
        </Pressable>
      </View>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View className="flex-row items-center justify-between" style={{ gap: theme.space[3] }}>
      <AppText variant="body" className="flex-1">{label}</AppText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: theme.color.neutral[300], true: theme.color.primary.base }}
        thumbColor={theme.color.surface.page}
      />
    </View>
  );
}

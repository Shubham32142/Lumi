import { Alert, Pressable, Share, Switch, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '@/theme';
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

function makeInviteCode(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `CYC-${code}`;
}

export default function Settings() {
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
    toast.info('Logged out — your data stays on this device.');
  }

  function confirmDeleteAccount() {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your cloud account and all synced data. This cannot be undone. Your data on this device will stay.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              toast.success('Account deleted.');
            } catch {
              toast.error('Could not delete the account — check your connection.');
            }
          },
        },
      ],
    );
  }

  async function syncNow() {
    try {
      await cloudSync(false);
      toast.success('Synced ☁️');
    } catch {
      toast.error('Sync failed — check your connection.');
    }
  }

  const sharing = profile.partnerSharing;
  const notif = profile.notificationPrefs;
  const providerMeta = PROVIDERS[aiConfig.provider];

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[6] }}>
        {/* ── Luna & AI ── */}
        <Section title="Luna & AI 🤖">
          <Card>
            <View style={{ gap: theme.space[3] }}>
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
                  {providerMeta.label} — we never see it. 🔒
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

        {/* ── Cycle ── */}
        <Section title="Your cycle 🌙">
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
                  toast.success('Period start saved 🩸');
                }}
              />
            </View>
          </Card>
        </Section>

        {/* ── Tracked symptoms ── */}
        <Section title="What you track ✅">
          <Card>
            <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
              {TRACK_OPTIONS.map((o) => (
                <ChoiceChip
                  key={o.key}
                  label={o.title}
                  emoji={o.emoji}
                  selected={profile.trackedSymptoms.includes(o.key)}
                  onPress={() => toggleTracked(o.key)}
                />
              ))}
            </View>
          </Card>
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications 🔔">
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
        <Section title="Partner sharing 💞">
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
          </Card>
        </Section>

        {/* ── Account ── */}
        <Section title="Account ☁️">
          <Card>
            {session ? (
              <View style={{ gap: theme.space[3] }}>
                <View style={{ gap: theme.space[1] }}>
                  <AppText variant="label">Signed in</AppText>
                  <AppText variant="body">{session.email}</AppText>
                  <AppText variant="caption">
                    {syncing
                      ? 'Syncing…'
                      : 'Your logs and settings back up to the cloud automatically. Your AI key stays on this device. ☁️'}
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
                  Permanently removes your cloud account and synced data. Your data on this device
                  stays unless you also delete it below.
                </AppText>
              </View>
            ) : (
              <View style={{ gap: theme.space[3] }}>
                <AppText variant="body">
                  You're in local mode — everything lives on this device. Create an account for cloud
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
        <Section title="Data & privacy 🔒">
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: theme.space[3] }}>
      <AppText variant="h2">{title}</AppText>
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

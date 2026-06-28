import { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { router } from 'expo-router';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '@/theme';
import {
  DEFAULT_PROFILE,
  DEFAULT_TRACKED,
  useStore,
} from '@/lib/store';
import type {
  AgeRange,
  ExperienceLevel,
  Profile,
  SymptomKey,
} from '@/lib/types';
import { formatLong } from '@/lib/date';
import { SYMPTOM_CONFIG } from '@/lib/symptoms';
import {
  AppText,
  Button,
  Card,
  ChoiceChip,
  FadeIn,
  ProgressDots,
  Screen,
} from '@/components/ui';
import { MonthCalendar, type Cursor } from '@/components/MonthCalendar';
import { Logo } from '@/components/Logo';

const STEPS = 9;

const EXPERIENCE: { value: ExperienceLevel; label: string; hint: string }[] = [
  { value: 'first_timer', label: 'First Timer', hint: "New to all this — keep it simple" },
  { value: 'somewhat_familiar', label: 'Somewhat Familiar', hint: 'I know the basics' },
  { value: 'know_my_cycle', label: 'I Know My Cycle', hint: 'Give me the details' },
];

const AGES: AgeRange[] = ['13-17', '18-25', '26-35', '36+'];

const TRACK_OPTIONS: { key: SymptomKey; title: string; emoji: string }[] = [
  ...Object.values(SYMPTOM_CONFIG).map((c) => ({ key: c.key, title: c.title, emoji: c.emoji })),
  { key: 'pain', title: 'Pain', emoji: '🤕' },
];

export default function Onboarding() {
  const completeOnboarding = useStore((s) => s.completeOnboarding);

  const now = new Date();
  const [step, setStep] = useState(0);
  const [experienceLevel, setExperience] = useState<ExperienceLevel>('somewhat_familiar');
  const [ageRange, setAgeRange] = useState<AgeRange>('18-25');
  const [periodKnown, setPeriodKnown] = useState(true);
  const [lastPeriodDate, setLastPeriodDate] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Cursor>({ year: now.getFullYear(), monthIndex: now.getMonth() });
  const [cycleLength, setCycleLength] = useState(28);
  const [isIrregular, setIrregular] = useState(false);
  const [tracked, setTracked] = useState<SymptomKey[]>(DEFAULT_TRACKED);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [periodReminders, setPeriodReminders] = useState(true);
  const [phaseTransitions, setPhaseTransitions] = useState(true);
  const [selfCareNudges, setSelfCareNudges] = useState(true);

  function toggleTracked(key: SymptomKey) {
    setTracked((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function finish() {
    const profile: Profile = {
      experienceLevel,
      ageRange,
      cycleLength,
      periodLength: DEFAULT_PROFILE.periodLength,
      lastPeriodDate: periodKnown ? lastPeriodDate : null,
      isIrregular,
      trackedSymptoms: tracked,
      notificationPrefs: {
        enabled: notifEnabled,
        dailyCheckInTime: notifEnabled ? '20:00' : null,
        periodReminders,
        phaseTransitions,
        selfCareNudges,
      },
      partnerSharing: DEFAULT_PROFILE.partnerSharing,
    };
    completeOnboarding(profile);
    router.replace('/');
  }

  const next = () => (step >= STEPS - 1 ? finish() : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Screen contentBottom={theme.space[4]}>
      <View style={{ paddingTop: theme.space[4], paddingBottom: theme.space[6] }}>
        <ProgressDots total={STEPS} current={step} />
      </View>

      {step === 0 && (
        <StepShell emoji="🌙" title="Hey! Welcome to Lumi"
          body="A few quick questions so the app can speak to your body — not a generic average. No name needed, ever.">
          <View className="items-center" style={{ paddingVertical: theme.space[2] }}>
            <Logo size={72} />
          </View>
          <Card roomy>
            <AppText variant="body">
              This isn't about perfect tracking. It's about understanding why you feel
              what you feel — and what actually helps. 💜
            </AppText>
          </Card>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/auth?mode=login')}
            className="items-center py-2 active:opacity-70"
          >
            <AppText variant="bodySm" style={{ color: theme.color.primary.base }}>
              Already have an account? Log in
            </AppText>
          </Pressable>
        </StepShell>
      )}

      {step === 1 && (
        <StepShell emoji="🧭" title="How well do you know your cycle?"
          body="We'll adjust how much detail we throw at you.">
          <View style={{ gap: theme.space[2] }}>
            {EXPERIENCE.map((o) => (
              <Card key={o.value}>
                <ChoiceChip
                  label={`${o.label} — ${o.hint}`}
                  selected={experienceLevel === o.value}
                  onPress={() => setExperience(o.value)}
                />
              </Card>
            ))}
          </View>
        </StepShell>
      )}

      {step === 2 && (
        <StepShell emoji="🎂" title="Which age range fits you?"
          body="Helps us tailor content. That's it.">
          <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
            {AGES.map((a) => (
              <ChoiceChip key={a} label={a} selected={ageRange === a} onPress={() => setAgeRange(a)} />
            ))}
          </View>
        </StepShell>
      )}

      {step === 3 && (
        <StepShell emoji="🗓️" title="When did your last period start?"
          body="Tap the day it began. Not sure? Totally fine — skip it.">
          <View style={{ gap: theme.space[3] }}>
            <ChoiceChip
              label="I'm not sure"
              emoji="🤷"
              selected={!periodKnown}
              onPress={() => {
                setPeriodKnown(false);
                setLastPeriodDate(null);
              }}
            />
            {periodKnown && (
              <Card>
                <MonthCalendar
                  cursor={cursor}
                  onCursorChange={setCursor}
                  selected={lastPeriodDate}
                  disableFuture
                  onSelectDay={(iso) => {
                    setLastPeriodDate(iso);
                    setPeriodKnown(true);
                  }}
                />
              </Card>
            )}
            {periodKnown && lastPeriodDate ? (
              <AppText variant="secondary">Got it — {formatLong(lastPeriodDate)}</AppText>
            ) : null}
            {!periodKnown ? (
              <ChoiceChip
                label="Actually, let me pick a date"
                selected={periodKnown}
                onPress={() => setPeriodKnown(true)}
              />
            ) : null}
          </View>
        </StepShell>
      )}

      {step === 4 && (
        <StepShell emoji="📏" title="How long is your cycle, usually?"
          body="From the first day of one period to the next. The average is 28 — but yours is yours.">
          <View style={{ gap: theme.space[4] }}>
            <Card roomy>
              <View className="flex-row items-center justify-between">
                <Stepper
                  value={cycleLength}
                  min={21}
                  max={35}
                  disabled={isIrregular}
                  onChange={setCycleLength}
                />
              </View>
            </Card>
            <ChoiceChip
              label="It's irregular"
              emoji="🌀"
              selected={isIrregular}
              onPress={() => setIrregular((v) => !v)}
            />
            {isIrregular ? (
              <AppText variant="secondary">
                No problem — we'll predict gently and learn as you log. Nothing here is "abnormal".
              </AppText>
            ) : null}
          </View>
        </StepShell>
      )}

      {step === 5 && (
        <StepShell emoji="✅" title="What do you want to track?"
          body="Pick what matters to you. You can change this anytime.">
          <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
            {TRACK_OPTIONS.map((o) => (
              <ChoiceChip
                key={o.key}
                label={o.title}
                emoji={o.emoji}
                selected={tracked.includes(o.key)}
                onPress={() => toggleTracked(o.key)}
              />
            ))}
          </View>
        </StepShell>
      )}

      {step === 6 && (
        <StepShell emoji="🔔" title="Want gentle nudges?"
          body="All opt-in. We'll never spam you.">
          <View style={{ gap: theme.space[2] }}>
            <ToggleRow label="Enable notifications" value={notifEnabled} onChange={setNotifEnabled} />
            {notifEnabled && (
              <>
                <ToggleRow label="Period reminders (3 & 1 days before)" value={periodReminders} onChange={setPeriodReminders} />
                <ToggleRow label="Phase transition alerts" value={phaseTransitions} onChange={setPhaseTransitions} />
                <ToggleRow label="Self-care nudges during PMS week" value={selfCareNudges} onChange={setSelfCareNudges} />
                <AppText variant="secondary">Daily check-in reminder set for 8:00 PM (editable in Settings).</AppText>
              </>
            )}
          </View>
        </StepShell>
      )}

      {step === 7 && (
        <StepShell emoji="💞" title="Partner mode (optional)"
          body="Let someone close understand your cycle and show up better. You control exactly what they see.">
          <Card roomy>
            <AppText variant="body">
              You can set this up anytime from Settings → Partner sharing. For now, let's
              skip ahead. 💜
            </AppText>
          </Card>
        </StepShell>
      )}

      {step === 8 && (
        <StepShell emoji="🚀" title="You're all set!"
          body="You can use everything right now — no account needed. Your data stays on this device.">
          <Card roomy>
            <AppText variant="body">
              Want cloud backup and sync across devices? Create an account — email + password,
              nothing else. Or skip it and jump straight in.
            </AppText>
          </Card>
          <Button
            title="Create an account (optional)"
            variant="secondary"
            onPress={() => router.push('/auth?mode=signup')}
          />
        </StepShell>
      )}

      {/* Footer nav */}
      <View className="flex-row" style={{ gap: theme.space[2], marginTop: theme.space[6] }}>
        {step > 0 ? (
          <View className="flex-1">
            <Button title="Back" variant="secondary" onPress={back} />
          </View>
        ) : null}
        <View className="flex-1">
          <Button title={step >= STEPS - 1 ? "Let's go 🎉" : 'Continue'} onPress={next} />
        </View>
      </View>
      <View style={{ height: theme.space[8] }} />
    </Screen>
  );
}

function StepShell({
  emoji,
  title,
  body,
  children,
}: {
  emoji: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn>
      <View style={{ gap: theme.space[4] }}>
        <View style={{ gap: theme.space[2] }}>
          <AppText variant="h1">
            {emoji} {title}
          </AppText>
          <AppText variant="secondary">{body}</AppText>
        </View>
        {children}
      </View>
    </FadeIn>
  );
}

function Stepper({
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (n: number) => void;
}) {
  return (
    <View className="w-full flex-row items-center justify-between">
      <StepBtn icon="minus" disabled={disabled || value <= min} onPress={() => onChange(value - 1)} />
      <View className="items-center">
        <AppText variant="h1" style={{ opacity: disabled ? 0.4 : 1 }}>
          {value}
        </AppText>
        <AppText variant="caption">days</AppText>
      </View>
      <StepBtn icon="plus" disabled={disabled || value >= max} onPress={() => onChange(value + 1)} />
    </View>
  );
}

function StepBtn({
  icon,
  disabled,
  onPress,
}: {
  icon: 'plus' | 'minus';
  disabled?: boolean;
  onPress: () => void;
}) {
  const Icon = icon === 'plus' ? Plus : Minus;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`rounded-md border p-3 ${
        disabled ? 'border-line bg-muted' : 'border-line-input bg-page active:bg-hover'
      }`}
    >
      <Icon
        size={theme.size.iconMd}
        color={disabled ? theme.color.text.secondary : theme.color.text.label}
      />
    </Pressable>
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
    <Card>
      <View className="flex-row items-center justify-between" style={{ gap: theme.space[3] }}>
        <View className="flex-1">
          <AppText variant="body">{label}</AppText>
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: theme.color.neutral[300], true: theme.color.primary.base }}
          thumbColor={theme.color.surface.page}
        />
      </View>
    </Card>
  );
}

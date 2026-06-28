import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn as RFadeIn } from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { theme, lineHeight } from '@/theme';
import { useStore } from '@/lib/store';
import type { CycleLog, PainType, SymptomKey } from '@/lib/types';
import { formatLong, todayISO } from '@/lib/date';
import { PAIN_TYPES, SYMPTOM_CONFIG, SYMPTOM_ORDER } from '@/lib/symptoms';
import { AppText, Button, ChoiceChip, FadeIn, Screen } from '@/components/ui';

// Symptom config keys → CycleLog field names (they don't all match 1:1).
const LOG_FIELD: Record<Exclude<SymptomKey, 'pain'>, keyof CycleLog> = {
  mood: 'mood',
  energy: 'energy',
  cravings: 'cravings',
  bloating: 'bloating',
  sleep: 'sleepQuality',
  flow: 'flowIntensity',
  clarity: 'mentalClarity',
  social: 'socialBattery',
};

export default function Log() {
  const params = useLocalSearchParams<{ date?: string }>();
  const date = params.date ?? todayISO();
  const tracked = useStore((s) => s.profile.trackedSymptoms);
  const log = useStore((s) => s.logs[date]); // reactive — edits reflect everywhere live
  const upsertLog = useStore((s) => s.upsertLog);

  // Bumps on every change so the "Saved" pill re-animates.
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const bump = () => setSavedAt(Date.now());

  const isTracked = (k: SymptomKey) => tracked.includes(k);

  function setField(field: keyof CycleLog, value: string) {
    upsertLog(date, { [field]: log?.[field] === value ? undefined : value } as Partial<CycleLog>);
    bump();
  }

  function toggleMulti(value: string) {
    const arr = (log?.cravings as string[] | undefined) ?? [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    upsertLog(date, { cravings: (next.length ? next : undefined) as CycleLog['cravings'] });
    bump();
  }

  function togglePain(type: PainType) {
    const arr = log?.pain ?? [];
    const exists = arr.find((p) => p.type === type);
    const next = exists ? arr.filter((p) => p.type !== type) : [...arr, { type, intensity: 3 }];
    upsertLog(date, { pain: next.length ? next : undefined });
    bump();
  }

  function setPainIntensity(type: PainType, intensity: number) {
    upsertLog(date, { pain: (log?.pain ?? []).map((p) => (p.type === type ? { ...p, intensity } : p)) });
    bump();
  }

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <View style={{ gap: theme.space[1] }}>
          <View className="flex-row items-center justify-between">
            <AppText variant="secondary">
              {date === todayISO() ? 'Daily check-in' : formatLong(date)}
            </AppText>
            {savedAt ? (
              <Animated.View
                key={savedAt}
                entering={RFadeIn.duration(260)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: theme.radius.md,
                  borderWidth: theme.borderWidth,
                  borderColor: theme.color.status.success,
                  paddingHorizontal: theme.space[2],
                  paddingVertical: theme.space[1],
                  gap: theme.space[1],
                }}
              >
                <Check size={theme.size.iconSm} color={theme.color.status.success} />
                <AppText variant="caption" style={{ color: theme.color.status.success }}>
                  Saved
                </AppText>
              </Animated.View>
            ) : null}
          </View>
          <AppText variant="h1">How are you feeling? 💭</AppText>
          <AppText variant="secondary">
            Tap what fits — it saves on its own. Skip what doesn’t. ✨
          </AppText>
        </View>

        {/* Single & multi select symptom groups */}
        {SYMPTOM_ORDER.filter(isTracked).map((key, idx) => {
          const cfg = SYMPTOM_CONFIG[key];
          const field = LOG_FIELD[key];
          const selectedValue = log?.[field];
          return (
            <FadeIn key={key} delay={idx * 45}>
              <View style={{ gap: theme.space[2] }}>
                <AppText variant="label">
                  {cfg.emoji} {cfg.title}
                </AppText>
                <View className="flex-row flex-wrap" style={{ gap: theme.space[2] }}>
                  {cfg.options.map((opt) => {
                    const isSelected = cfg.multi
                      ? Array.isArray(selectedValue) && (selectedValue as string[]).includes(opt.value)
                      : selectedValue === opt.value;
                    return (
                      <ChoiceChip
                        key={opt.value}
                        label={opt.label}
                        emoji={opt.emoji}
                        selected={isSelected}
                        onPress={() => (cfg.multi ? toggleMulti(opt.value) : setField(field, opt.value))}
                      />
                    );
                  })}
                </View>
              </View>
            </FadeIn>
          );
        })}

        {/* Pain — type + 1–5 intensity */}
        {isTracked('pain') ? (
          <FadeIn delay={SYMPTOM_ORDER.length * 45}>
            <View style={{ gap: theme.space[2] }}>
              <AppText variant="label">🤕 Pain</AppText>
              <View style={{ gap: theme.space[2] }}>
                {PAIN_TYPES.map((p) => {
                  const entry = log?.pain?.find((x) => x.type === p.value);
                  return (
                    <View key={p.value} style={{ gap: theme.space[2] }}>
                      <ChoiceChip
                        label={p.label}
                        emoji={p.emoji}
                        selected={Boolean(entry)}
                        onPress={() => togglePain(p.value as PainType)}
                      />
                      {entry ? (
                        <View className="flex-row items-center" style={{ gap: theme.space[2] }}>
                          <AppText variant="caption">Intensity</AppText>
                          {[1, 2, 3, 4, 5].map((n) => (
                            <ChoiceChip
                              key={n}
                              label={String(n)}
                              selected={entry.intensity === n}
                              onPress={() => setPainIntensity(p.value as PainType, n)}
                            />
                          ))}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </View>
          </FadeIn>
        ) : null}

        {/* Notes */}
        <View style={{ gap: theme.space[2] }}>
          <AppText variant="label">📝 Anything else?</AppText>
          <TextInput
            value={log?.notes ?? ''}
            onChangeText={(t) => {
              upsertLog(date, { notes: t || undefined });
              bump();
            }}
            placeholder="A quick note to your future self…"
            placeholderTextColor={theme.color.text.secondary}
            multiline
            className="rounded-md border border-line-input bg-page p-3 text-base text-ink"
            style={{ minHeight: 88, textAlignVertical: 'top', lineHeight: lineHeight(theme.font.size.base) }}
          />
        </View>

        <Button title="Back to Today" variant="secondary" onPress={() => router.push('/')} />
      </View>
    </Screen>
  );
}

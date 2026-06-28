// The Home "reading": what Lumi tells you about today from your phase alone, with
// no input required (the instant reward). Then it invites a one-tap confirm or a
// quick correction, so logging feels like deepening a friendship, not a chore.
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import {
  Apple,
  ArrowDown,
  ArrowUp,
  Brain,
  ChevronsUp,
  ChevronRight,
  Footprints,
  Lightbulb,
  Minus,
  Moon,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import { toast } from '@/lib/toast';
import type { Phase } from '@/lib/types';
import { phaseColors } from '@/theme/phases';
import { PHASE_READING, type SuggestionIcon, type Trend } from '@/content/reading';
import { todayISO } from '@/lib/date';
import { AppText, Button, Card } from '@/components/ui';

const TREND_ICON: Record<Trend, LucideIcon> = {
  up: ArrowUp,
  down: ArrowDown,
  peak: ChevronsUp,
  calm: Minus,
};

const SUGGESTION_ICON: Record<SuggestionIcon, LucideIcon> = {
  rest: Moon,
  eat: Apple,
  move: Footprints,
  mind: Lightbulb,
};

export function DailyReading({ phase }: { phase: Phase }) {
  const theme = useTheme();
  const logs = useStore((s) => s.logs);
  const upsertLog = useStore((s) => s.upsertLog);

  const reading = PHASE_READING[phase];
  const { accent, soft } = phaseColors(theme.color, phase);
  const today = todayISO();
  const todayLog = logs[today];
  const checkedIn = Boolean(todayLog && (todayLog.mood || todayLog.energy));

  function confirm() {
    upsertLog(today, { mood: reading.predictedMood, energy: reading.predictedEnergy });
    toast.success('Noted. The more you share, the better I know you.');
  }

  return (
    <Card roomy>
      <View style={{ gap: theme.space[4] }}>
        {/* Reading headline */}
        <View style={{ gap: theme.space[2] }}>
          <AppText variant="label" style={{ color: accent }}>
            TODAY
          </AppText>
          <AppText variant="h3">{reading.headline}</AppText>
        </View>

        {/* Outlook: four glanceable states */}
        <View className="flex-row" style={{ gap: theme.space[2] }}>
          {reading.outlook.map((o) => {
            const TrendIcon = TREND_ICON[o.trend];
            return (
              <View
                key={o.key}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 3,
                  backgroundColor: theme.color.surface.muted,
                  borderRadius: theme.radius.md,
                  paddingVertical: theme.space[2],
                }}
              >
                <AppText variant="caption" style={{ textTransform: 'capitalize' }}>
                  {o.key}
                </AppText>
                <View className="flex-row items-center" style={{ gap: 2 }}>
                  <TrendIcon size={13} color={accent} />
                  <AppText variant="bodySm" style={{ color: theme.color.text.primary }}>
                    {o.label}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>

        {/* Why, with depth pushed to Learn */}
        <View
          className="rounded-md"
          style={{ backgroundColor: soft, padding: theme.space[3], gap: theme.space[1] }}
        >
          <AppText variant="bodySm" className="text-ink">
            {reading.why}
          </AppText>
          <Pressable
            onPress={() => router.push('/learn')}
            accessibilityRole="button"
            className="flex-row items-center self-start active:opacity-70"
            style={{ gap: 2 }}
          >
            <AppText variant="caption" style={{ color: accent }}>
              Why this happens
            </AppText>
            <ChevronRight size={13} color={accent} />
          </Pressable>
        </View>

        {/* For you today — each nudge taps through to concrete specifics */}
        <View style={{ gap: theme.space[2] }}>
          <View className="flex-row items-center justify-between">
            <AppText variant="label">For you today</AppText>
            <AppText variant="caption">Tap for specifics</AppText>
          </View>
          {reading.suggestions.map((s, i) => {
            const Icon = SUGGESTION_ICON[s.icon];
            return (
              <Pressable
                key={i}
                onPress={() => router.push(`/suggestion?phase=${phase}&i=${i}`)}
                accessibilityRole="button"
                className="flex-row items-center rounded-md active:bg-hover"
                style={{ gap: theme.space[3], paddingVertical: theme.space[1] }}
              >
                <Icon size={theme.size.iconMd} color={accent} />
                <View style={{ flex: 1 }}>
                  <AppText variant="bodySm" style={{ color: theme.color.text.primary, fontFamily: theme.font.family.sansSemibold }}>
                    {s.label}
                  </AppText>
                  <AppText variant="secondary">{s.text}</AppText>
                </View>
                <ChevronRight size={theme.size.iconSm} color={theme.color.text.secondary} />
              </Pressable>
            );
          })}
        </View>

        {/* Confirm or correct: logging, reframed */}
        {checkedIn ? (
          <View style={{ gap: theme.space[2] }}>
            <View
              className="rounded-md border"
              style={{ borderColor: theme.color.border.default, padding: theme.space[3] }}
            >
              <AppText variant="bodySm" className="text-ink">
                You checked in today. I'll keep learning your pattern.
              </AppText>
            </View>
            <Button
              title="Update today's check-in"
              variant="secondary"
              onPress={() => router.push('/log')}
            />
          </View>
        ) : (
          <View style={{ gap: theme.space[2] }}>
            <AppText variant="secondary">Does this sound like you today?</AppText>
            <Button title="Yes, that's me" onPress={confirm} />
            <Button
              title="Not quite, let me say how I feel"
              variant="secondary"
              onPress={() => router.push('/log')}
            />
          </View>
        )}
      </View>
    </Card>
  );
}

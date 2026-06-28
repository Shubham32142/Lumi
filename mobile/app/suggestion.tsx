// The concrete layer behind a Home suggestion: when a nudge ("eat fresh food")
// isn't specific enough, this shows exactly what we mean — scannable, on-platform,
// so the user never has to leave Lumi to find out. Opened as a light modal.
import { Pressable, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Apple, ChevronRight, Footprints, Lightbulb, Moon, type LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/theme';
import { useStore } from '@/lib/store';
import type { Phase } from '@/lib/types';
import { phaseColors } from '@/theme/phases';
import { PHASE_READING, type SuggestionIcon } from '@/content/reading';
import { AppText, Card, Screen } from '@/components/ui';

const ICON: Record<SuggestionIcon, LucideIcon> = {
  rest: Moon,
  eat: Apple,
  move: Footprints,
  mind: Lightbulb,
};

const PHASES: Phase[] = ['menstruation', 'follicular', 'ovulation', 'luteal'];

export default function SuggestionDetailScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ phase?: string; i?: string }>();
  const phase = PHASES.includes(params.phase as Phase) ? (params.phase as Phase) : 'menstruation';
  const index = Number(params.i ?? 0);
  const suggestion = PHASE_READING[phase].suggestions[index];

  if (!suggestion) {
    return (
      <Screen>
        <View style={{ paddingTop: theme.space[4] }}>
          <AppText variant="body">Nothing to show here.</AppText>
        </View>
      </Screen>
    );
  }

  const diet = useStore((s) => s.profile.diet);
  const detail = suggestion.detail;
  // Veg users never see non-veg items; non-veg users see everything.
  const items = detail.items.filter((it) => diet === 'nonveg' || it.diet !== 'nonveg');
  const Icon = ICON[suggestion.icon];
  const { accent, soft } = phaseColors(theme.color, phase);

  return (
    <Screen contentBottom={theme.space[8]}>
      <View style={{ paddingTop: theme.space[2], gap: theme.space[4] }}>
        <View className="flex-row items-center" style={{ gap: theme.space[3] }}>
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: theme.radius.full,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: soft,
            }}
          >
            <Icon size={22} color={accent} />
          </View>
          <AppText variant="h2" style={{ flex: 1 }}>
            {detail.title}
          </AppText>
        </View>

        <Card>
          <View style={{ gap: theme.space[3] }}>
            {items.map((it, k) => (
              <View key={k} className="flex-row items-start" style={{ gap: theme.space[3] }}>
                <View
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    backgroundColor: accent,
                    marginTop: 7,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <AppText
                    variant="body"
                    style={{ fontFamily: theme.font.family.sansSemibold }}
                  >
                    {it.name}
                  </AppText>
                  {it.note ? <AppText variant="secondary">{it.note}</AppText> : null}
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View className="rounded-md" style={{ backgroundColor: soft, padding: theme.space[3] }}>
          <AppText variant="bodySm" className="text-ink">
            {detail.why}
          </AppText>
        </View>

        <Pressable
          onPress={() => router.push('/learn')}
          accessibilityRole="button"
          className="flex-row items-center self-start active:opacity-70"
          style={{ gap: 2 }}
        >
          <AppText variant="label" style={{ color: accent }}>
            Read the full story in Learn
          </AppText>
          <ChevronRight size={theme.size.iconSm} color={accent} />
        </Pressable>
      </View>
    </Screen>
  );
}

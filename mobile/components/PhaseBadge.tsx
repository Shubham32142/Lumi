// A compact phase indicator: emoji + friendly name + (optional) cycle day.
import { View } from 'react-native';
import { theme } from '@/theme';
import type { Phase } from '@/lib/types';
import { phaseMeta } from '@/theme/phases';
import { AppText, Floaty } from '@/components/ui';

interface PhaseBadgeProps {
  phase: Phase;
  dayOfCycle?: number;
}

export function PhaseBadge({ phase, dayOfCycle }: PhaseBadgeProps) {
  const meta = phaseMeta(phase);
  return (
    <View
      className="flex-row items-center self-start rounded-md border px-3 py-2"
      style={{ backgroundColor: meta.soft, borderColor: meta.accent, gap: theme.space[2] }}
    >
      <Floaty distance={4} duration={1400}>
        <AppText variant="title">{meta.emoji}</AppText>
      </Floaty>
      <View>
        <AppText variant="title" style={{ color: meta.accent }}>
          {meta.name}
        </AppText>
        {dayOfCycle != null ? (
          <AppText variant="caption" style={{ color: meta.accent }}>
            Cycle day {dayOfCycle} · {meta.dayRange}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

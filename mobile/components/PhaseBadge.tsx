// A compact phase indicator: phase icon + friendly name + (optional) cycle day.
import { View } from 'react-native';
import { useTheme } from '@/theme';
import type { Phase } from '@/lib/types';
import { phaseColors, phaseMeta } from '@/theme/phases';
import { AppText } from '@/components/ui';

interface PhaseBadgeProps {
  phase: Phase;
  dayOfCycle?: number;
}

export function PhaseBadge({ phase, dayOfCycle }: PhaseBadgeProps) {
  const theme = useTheme();
  const meta = phaseMeta(phase);
  const PhaseIcon = meta.icon;
  const { accent, soft } = phaseColors(theme.color, phase);
  return (
    <View
      className="flex-row items-center self-start rounded-md border px-3 py-2"
      style={{ backgroundColor: soft, borderColor: accent, gap: theme.space[2] }}
    >
      <PhaseIcon size={theme.size.iconMd} color={accent} />
      <View>
        <AppText variant="title" style={{ color: accent }}>
          {meta.name}
        </AppText>
        {dayOfCycle != null ? (
          <AppText variant="caption" style={{ color: accent }}>
            Cycle day {dayOfCycle} · {meta.dayRange}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

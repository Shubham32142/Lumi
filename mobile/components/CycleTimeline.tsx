// "Where am I in my cycle?" — the four phases of the CURRENT cycle laid out with
// real dates, the active one highlighted, and a plain-English definition on tap.
// Answers: which phase am I in, and when are follicular / ovulation / luteal.
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { theme } from '@/theme';
import type { Phase, Profile } from '@/lib/types';
import { phaseMeta } from '@/theme/phases';
import { cyclePhaseRanges, dayOfCycle } from '@/lib/cycle';
import { daysBetween, formatShort, todayISO } from '@/lib/date';
import { AppText } from '@/components/ui';

export function CycleTimeline({ profile }: { profile: Profile }) {
  const today = todayISO();
  const ranges = cyclePhaseRanges(profile, today);
  const currentPhase = ranges?.find((r) => today >= r.startISO && today <= r.endISO)?.phase ?? null;
  const [open, setOpen] = useState<Phase | null>(currentPhase);

  if (!ranges) return null;
  const day = dayOfCycle(profile, today);

  return (
    <View style={{ gap: theme.space[2] }}>
      {ranges.map((r) => {
        const meta = phaseMeta(r.phase);
        const isCurrent = r.phase === currentPhase;
        const isPast = today > r.endISO;
        const daysAway = daysBetween(today, r.startISO);
        const status = isCurrent
          ? day != null
            ? `You're here · day ${day}`
            : "You're here"
          : isPast
            ? 'Done'
            : daysAway === 1
              ? 'Starts tomorrow'
              : `In ${daysAway} days`;
        const expanded = open === r.phase;

        return (
          <Pressable
            key={r.phase}
            onPress={() => setOpen(expanded ? null : r.phase)}
            accessibilityRole="button"
            className="rounded-lg border"
            style={{
              borderColor: isCurrent ? meta.accent : theme.color.border.default,
              backgroundColor: isCurrent ? meta.soft : theme.color.surface.page,
              padding: theme.space[3],
              opacity: isPast && !expanded ? 0.65 : 1,
            }}
          >
            <View className="flex-row items-center" style={{ gap: theme.space[3] }}>
              {/* phase dot */}
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 999,
                  backgroundColor: isPast ? theme.color.surface.page : meta.accent,
                  borderWidth: isPast ? 2 : 0,
                  borderColor: meta.accent,
                }}
              />
              <View style={{ flex: 1 }}>
                <View className="flex-row items-center" style={{ gap: theme.space[1] }}>
                  <AppText variant="title">
                    {meta.emoji} {meta.name}
                  </AppText>
                </View>
                <AppText variant="caption">
                  {meta.clinical} · {formatShort(r.startISO)}–{formatShort(r.endISO)}
                </AppText>
              </View>
              <View
                className="rounded-full"
                style={{
                  backgroundColor: isCurrent ? meta.accent : theme.color.surface.muted,
                  paddingHorizontal: theme.space[2],
                  paddingVertical: 3,
                }}
              >
                <AppText
                  variant="caption"
                  style={{ color: isCurrent ? theme.color.text.onPrimary : theme.color.text.label }}
                >
                  {status}
                </AppText>
              </View>
              <ChevronDown
                size={theme.size.iconSm}
                color={theme.color.text.secondary}
                style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
              />
            </View>

            {expanded ? (
              <AppText variant="bodySm" className="text-ink-label" style={{ marginTop: theme.space[2] }}>
                {meta.definition}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

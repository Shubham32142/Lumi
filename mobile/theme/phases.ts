// Display metadata for the four cycle phases. Friendly names, a line-icon, and
// accent colours flow from the design tokens. We use icons (not emoji) so the
// phase identity is consistent and on-brand on every device.
import { Droplet, Moon, Sprout, Sun, type LucideIcon } from 'lucide-react-native';
import { theme, type PhaseKey, type Theme } from '@/theme';
import type { Phase } from '@/lib/types';

export interface PhaseMeta {
  phase: Phase;
  key: PhaseKey;
  name: string; // friendly nickname
  clinical: string; // the medical name (so users learn the real term)
  icon: LucideIcon;
  dayRange: string;
  tagline: string; // short, punchy one-liner
  definition: string; // plain-English "what this phase actually is"
  accent: string; // strong accent color (token)
  soft: string; // soft tinted-but-solid background (token)
}

export const PHASES: Record<Phase, PhaseMeta> = {
  menstruation: {
    phase: 'menstruation',
    key: 'flow',
    name: 'Flow Days',
    clinical: 'Menstruation',
    icon: Droplet,
    dayRange: 'Day 1 to 5',
    tagline: 'Rest up. Your body is doing a lot right now.',
    definition:
      "Your period. The uterus sheds its lining and hormones sit at their lowest. Low energy is expected here, not laziness.",
    accent: theme.color.phase.flow.base,
    soft: theme.color.phase.flow.soft,
  },
  follicular: {
    phase: 'follicular',
    key: 'glow',
    name: 'Glow Week',
    clinical: 'Follicular phase',
    icon: Sprout,
    dayRange: 'Day 6 to 13',
    tagline: 'Your energy is climbing. A good week to start things.',
    definition:
      'Right after your period. Estrogen rises and an egg matures in the ovary, so your energy, mood, and focus climb back up.',
    accent: theme.color.phase.glow.base,
    soft: theme.color.phase.glow.soft,
  },
  ovulation: {
    phase: 'ovulation',
    key: 'peak',
    name: 'Peak Days',
    clinical: 'Ovulation',
    icon: Sun,
    dayRange: 'Day 14 to 16',
    tagline: 'Confidence and social energy are at their highest.',
    definition:
      'An egg is released. This is your fertile window. Estrogen peaks, so confidence, libido, and social energy peak too.',
    accent: theme.color.phase.peak.base,
    soft: theme.color.phase.peak.soft,
  },
  luteal: {
    phase: 'luteal',
    key: 'dip',
    name: 'The Dip',
    clinical: 'Luteal phase',
    icon: Moon,
    dayRange: 'Day 17 to 28',
    tagline: 'Be gentle with yourself this week.',
    definition:
      "After ovulation, before your period. Progesterone rises then drops, and that drop is what brings PMS, cravings, and lower mood.",
    accent: theme.color.phase.dip.base,
    soft: theme.color.phase.dip.soft,
  },
};

export const PHASE_ORDER: Phase[] = [
  'menstruation',
  'follicular',
  'ovulation',
  'luteal',
];

export function phaseMeta(phase: Phase): PhaseMeta {
  return PHASES[phase];
}

/**
 * Phase accent + soft colours from the ACTIVE theme (so they follow light/dark).
 * Prefer this over the static `meta.accent` / `meta.soft` inside components:
 *   const theme = useTheme();
 *   const { accent, soft } = phaseColors(theme.color, phase);
 */
export function phaseColors(
  color: Theme['color'],
  phase: Phase,
): { accent: string; soft: string } {
  const key = PHASES[phase].key;
  return { accent: color.phase[key].base, soft: color.phase[key].soft };
}

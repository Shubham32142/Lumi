// Display metadata for the four cycle phases. Friendly names, emojis, and accent
// colors all flow from the design tokens. Copy is playful per the brand.
import { theme, type PhaseKey } from '@/theme';
import type { Phase } from '@/lib/types';

export interface PhaseMeta {
  phase: Phase;
  key: PhaseKey;
  name: string; // friendly nickname
  clinical: string; // the medical name (so users learn the real term)
  emoji: string;
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
    emoji: '🩸',
    dayRange: 'Day 1–5',
    tagline: 'Rest up — your body is doing the most right now 🌊',
    definition:
      'Your period. The uterus sheds its lining and hormones sit at their lowest — so low energy is expected, not laziness.',
    accent: theme.color.phase.flow.base,
    soft: theme.color.phase.flow.soft,
  },
  follicular: {
    phase: 'follicular',
    key: 'glow',
    name: 'Glow Week',
    clinical: 'Follicular phase',
    emoji: '✨',
    dayRange: 'Day 6–13',
    tagline: 'Energy is climbing. Go make something!',
    definition:
      'Right after your period. Estrogen rises and an egg matures in the ovary — so energy, mood, and focus climb back up.',
    accent: theme.color.phase.glow.base,
    soft: theme.color.phase.glow.soft,
  },
  ovulation: {
    phase: 'ovulation',
    key: 'peak',
    name: 'Peak Days',
    clinical: 'Ovulation',
    emoji: '💫',
    dayRange: 'Day 14–16',
    tagline: 'Peak confidence and social battery. Shine ☀️',
    definition:
      'An egg is released. This is your fertile window — estrogen peaks, so confidence, libido, and social energy peak too.',
    accent: theme.color.phase.peak.base,
    soft: theme.color.phase.peak.soft,
  },
  luteal: {
    phase: 'luteal',
    key: 'dip',
    name: 'The Dip',
    clinical: 'Luteal phase',
    emoji: '🌧️',
    dayRange: 'Day 17–28',
    tagline: 'Be gentle with yourself this week 💜',
    definition:
      'After ovulation, before your period. Progesterone rises then drops — that drop is what brings PMS, cravings, and lower mood.',
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

// The daily "reading" — what the app tells you about yourself for free, from your
// phase alone, before you log anything. This is the instant reward: feeling seen.
// Voice: a warm, knowing friend. Suggestions change by phase.
import type { Energy, Mood, Phase } from '@/lib/types';

export type Trend = 'up' | 'down' | 'peak' | 'calm';

export interface OutlookItem {
  key: 'energy' | 'mood' | 'focus' | 'social';
  label: string; // one-word state, e.g. "Rising"
  trend: Trend;
}

export type SuggestionIcon = 'rest' | 'eat' | 'move' | 'mind';

export interface Suggestion {
  icon: SuggestionIcon;
  label: string; // e.g. "Eat"
  text: string; // the actual nudge
}

export interface PhaseReading {
  headline: string; // friend-voice, about today
  outlook: OutlookItem[];
  why: string; // short hormonal reason (depth lives in Learn)
  validation: string; // warm reassurance shown while logging
  suggestions: Suggestion[];
  // What a one-tap "this is me" logs as today's check-in.
  predictedMood: Mood;
  predictedEnergy: Energy;
}

export const PHASE_READING: Record<Phase, PhaseReading> = {
  menstruation: {
    headline: "Your body is working hard today. Low and slow is exactly right, not lazy.",
    outlook: [
      { key: 'energy', label: 'Low', trend: 'down' },
      { key: 'mood', label: 'Tender', trend: 'calm' },
      { key: 'focus', label: 'Soft', trend: 'down' },
      { key: 'social', label: 'Inward', trend: 'calm' },
    ],
    why: 'Estrogen and progesterone are at their lowest, so wanting to slow down is hormonal, not laziness.',
    validation: "Tired or tender is exactly on time. There is nothing to push through.",
    suggestions: [
      { icon: 'rest', label: 'Rest', text: 'Give yourself permission to do less. Warmth helps a lot.' },
      { icon: 'eat', label: 'Eat', text: 'Top up iron: leafy greens, lentils, a little dark chocolate.' },
      { icon: 'move', label: 'Move', text: 'A slow walk or gentle stretch, only if it feels good.' },
    ],
    predictedMood: 'calm',
    predictedEnergy: 'low',
  },
  follicular: {
    headline: "You are coming back online. Energy, ideas, and optimism are all on the way up.",
    outlook: [
      { key: 'energy', label: 'Rising', trend: 'up' },
      { key: 'mood', label: 'Bright', trend: 'up' },
      { key: 'focus', label: 'Sharp', trend: 'up' },
      { key: 'social', label: 'Open', trend: 'up' },
    ],
    why: 'Estrogen is climbing again, lifting mood, focus, and your appetite for new things.',
    validation: "Feeling good? Soak it in. Off? That is okay too. Both are useful to know.",
    suggestions: [
      { icon: 'mind', label: 'Do', text: 'A good day to start the thing you have been putting off.' },
      { icon: 'move', label: 'Move', text: 'Strength or a harder workout. Your body recovers well now.' },
      { icon: 'eat', label: 'Eat', text: 'Fresh, colourful food to match the rising energy.' },
    ],
    predictedMood: 'energized',
    predictedEnergy: 'high',
  },
  ovulation: {
    headline: "You are at your brightest. If there is a big thing to say or do, today is the day.",
    outlook: [
      { key: 'energy', label: 'Peak', trend: 'peak' },
      { key: 'mood', label: 'Confident', trend: 'peak' },
      { key: 'focus', label: 'Clear', trend: 'up' },
      { key: 'social', label: 'High', trend: 'peak' },
    ],
    why: 'Estrogen peaks with a testosterone nudge, so confidence and social energy peak too.',
    validation: "Big energy and big feelings both fit today. Tell me how it really lands.",
    suggestions: [
      { icon: 'mind', label: 'Say it', text: 'The conversation or pitch you keep postponing feels easiest now.' },
      { icon: 'move', label: 'Move', text: 'Channel the energy: a class, a long workout, a dance.' },
      { icon: 'eat', label: 'Eat', text: 'Light, fresh, and plenty of water to feel your best.' },
    ],
    predictedMood: 'happy',
    predictedEnergy: 'high',
  },
  luteal: {
    headline: "Things are winding down. Be on your own team this week. You have earned the softness.",
    outlook: [
      { key: 'energy', label: 'Dipping', trend: 'down' },
      { key: 'mood', label: 'Sensitive', trend: 'down' },
      { key: 'focus', label: 'Foggy', trend: 'down' },
      { key: 'social', label: 'Quiet', trend: 'down' },
    ],
    why: 'Progesterone rises then drops, and serotonin dips with it. That is what brings the PMS and cravings.',
    validation: "If you are low or on edge, it is the hormones talking, not you.",
    suggestions: [
      { icon: 'eat', label: 'Eat', text: 'Steady carbs and magnesium: oats, nuts, dark chocolate.' },
      { icon: 'rest', label: 'Protect', text: 'Lighten the schedule where you can. Say no without guilt.' },
      { icon: 'move', label: 'Move', text: 'Gentle movement lifts mood and eases bloating.' },
    ],
    predictedMood: 'flat',
    predictedEnergy: 'low',
  },
};

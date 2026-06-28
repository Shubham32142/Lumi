// Option metadata for the daily check-in. Labels + emojis are content (playful),
// the layout that renders them stays token-driven and flat.
import type { SymptomKey } from '@/lib/types';

export interface Option<T extends string = string> {
  value: T;
  label: string;
  emoji: string;
}

export interface SymptomConfig {
  key: Exclude<SymptomKey, 'pain'>;
  title: string;
  emoji: string;
  multi: boolean; // multi-select vs single-select
  options: Option[];
}

export const SYMPTOM_CONFIG: Record<Exclude<SymptomKey, 'pain'>, SymptomConfig> = {
  mood: {
    key: 'mood',
    title: 'Mood',
    emoji: '😊',
    multi: false,
    options: [
      { value: 'happy', label: 'Happy', emoji: '😊' },
      { value: 'calm', label: 'Calm', emoji: '😌' },
      { value: 'energized', label: 'Energized', emoji: '⚡' },
      { value: 'flat', label: 'Flat', emoji: '😐' },
      { value: 'anxious', label: 'Anxious', emoji: '😰' },
      { value: 'irritable', label: 'Irritable', emoji: '😤' },
      { value: 'sad', label: 'Sad', emoji: '😢' },
    ],
  },
  energy: {
    key: 'energy',
    title: 'Energy',
    emoji: '⚡',
    multi: false,
    options: [
      { value: 'high', label: 'High', emoji: '🔥' },
      { value: 'medium', label: 'Medium', emoji: '🔋' },
      { value: 'low', label: 'Low', emoji: '🪫' },
      { value: 'exhausted', label: 'Exhausted', emoji: '😴' },
    ],
  },
  cravings: {
    key: 'cravings',
    title: 'Cravings',
    emoji: '🍕',
    multi: true,
    options: [
      { value: 'sweet', label: 'Sweet', emoji: '🍫' },
      { value: 'salty', label: 'Salty', emoji: '🥨' },
      { value: 'carbs', label: 'Carbs', emoji: '🍞' },
      { value: 'everything', label: 'Everything', emoji: '🍽️' },
      { value: 'nothing', label: 'Nothing', emoji: '🚫' },
    ],
  },
  bloating: {
    key: 'bloating',
    title: 'Bloating',
    emoji: '💧',
    multi: false,
    options: [
      { value: 'none', label: 'None', emoji: '✅' },
      { value: 'mild', label: 'Mild', emoji: '💧' },
      { value: 'bad', label: 'Bad', emoji: '🎈' },
    ],
  },
  sleep: {
    key: 'sleep',
    title: 'Sleep',
    emoji: '😴',
    multi: false,
    options: [
      { value: 'great', label: 'Great', emoji: '😴' },
      { value: 'ok', label: 'OK', emoji: '🙂' },
      { value: 'poor', label: 'Poor', emoji: '🥱' },
    ],
  },
  flow: {
    key: 'flow',
    title: 'Flow',
    emoji: '🌊',
    multi: false,
    options: [
      { value: 'spotting', label: 'Spotting', emoji: '💧' },
      { value: 'light', label: 'Light', emoji: '🌦️' },
      { value: 'medium', label: 'Medium', emoji: '🌊' },
      { value: 'heavy', label: 'Heavy', emoji: '🌧️' },
    ],
  },
  clarity: {
    key: 'clarity',
    title: 'Mental clarity',
    emoji: '🧠',
    multi: false,
    options: [
      { value: 'sharp', label: 'Sharp', emoji: '🧠' },
      { value: 'foggy', label: 'Foggy', emoji: '🌫️' },
      { value: 'scattered', label: 'Scattered', emoji: '🦋' },
    ],
  },
  social: {
    key: 'social',
    title: 'Social battery',
    emoji: '💬',
    multi: false,
    options: [
      { value: 'social', label: 'Social', emoji: '💬' },
      { value: 'neutral', label: 'Neutral', emoji: '😶' },
      { value: 'leave_me_alone', label: 'Leave me alone', emoji: '🙅' },
    ],
  },
};

export const PAIN_TYPES: Option[] = [
  { value: 'cramps', label: 'Cramps', emoji: '🤕' },
  { value: 'headache', label: 'Headache', emoji: '🤯' },
  { value: 'back_pain', label: 'Back pain', emoji: '🦴' },
  { value: 'breast_tenderness', label: 'Breast tenderness', emoji: '💢' },
];

/** All tracked keys except `pain`, in display order, that the user opted into. */
export const SYMPTOM_ORDER: (keyof typeof SYMPTOM_CONFIG)[] = [
  'mood',
  'energy',
  'cravings',
  'bloating',
  'sleep',
  'flow',
  'clarity',
  'social',
];

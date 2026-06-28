// The daily "reading" — what the app tells you about yourself for free, from your
// phase alone, before you log anything. This is the instant reward: feeling seen.
// Voice: a warm, knowing friend. Suggestions change by phase.
//
// Each suggestion is one calm line on the Home, but carries a concrete `detail`
// (specific foods / movements / actions) shown one tap away, so the user never
// has to leave Lumi to find out what an abstract nudge actually means.
import type { Energy, Mood, Phase } from '@/lib/types';

export type Trend = 'up' | 'down' | 'peak' | 'calm';

export interface OutlookItem {
  key: 'energy' | 'mood' | 'focus' | 'social';
  label: string; // one-word state, e.g. "Rising"
  trend: Trend;
}

export type SuggestionIcon = 'rest' | 'eat' | 'move' | 'mind';

export interface DetailItem {
  name: string; // the concrete thing, e.g. "Spinach & kale"
  note?: string; // a 1-3 word reason, e.g. "iron"
}

export interface SuggestionDetail {
  title: string; // e.g. "What to eat in Glow Week"
  items: DetailItem[]; // concrete, scannable specifics (keep to ~6)
  why: string; // one line on why it helps
}

export interface Suggestion {
  icon: SuggestionIcon;
  label: string; // e.g. "Eat"
  text: string; // the calm one-line nudge
  detail: SuggestionDetail;
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
    headline: 'Your body is working hard today. Low and slow is exactly right, not lazy.',
    outlook: [
      { key: 'energy', label: 'Low', trend: 'down' },
      { key: 'mood', label: 'Tender', trend: 'calm' },
      { key: 'focus', label: 'Soft', trend: 'down' },
      { key: 'social', label: 'Inward', trend: 'calm' },
    ],
    why: 'Estrogen and progesterone are at their lowest, so wanting to slow down is hormonal, not laziness.',
    validation: 'Tired or tender is exactly on time. There is nothing to push through.',
    suggestions: [
      {
        icon: 'rest',
        label: 'Rest',
        text: 'Give yourself permission to do less. Warmth helps a lot.',
        detail: {
          title: 'Rest well on Flow Days',
          items: [
            { name: 'A warm bath or heat pack', note: 'eases cramps' },
            { name: 'An earlier night', note: 'your body is repairing' },
            { name: 'Drop one optional thing', note: 'protect your energy' },
            { name: 'Cosy comfort you enjoy', note: 'a film, a friend, tea' },
          ],
          why: 'Hormones are at their lowest, so resting now genuinely pays off later in your cycle.',
        },
      },
      {
        icon: 'eat',
        label: 'Eat',
        text: 'Top up iron: palak, dal, jaggery, a few dates.',
        detail: {
          title: 'What to eat on Flow Days',
          items: [
            { name: 'Palak & methi', note: 'iron' },
            { name: 'Dal, rajma, chana', note: 'iron + protein' },
            { name: 'Jaggery (gur)', note: 'iron' },
            { name: 'Dates & sesame (khajur, til)', note: 'iron' },
            { name: 'Amla or nimbu', note: 'vitamin C helps you absorb iron' },
            { name: 'Ginger or ajwain water', note: 'eases cramps' },
          ],
          why: 'Bleeding loses iron, which adds to the tired, foggy feeling. Pair iron foods with vitamin C like amla or nimbu to absorb more.',
        },
      },
      {
        icon: 'move',
        label: 'Move',
        text: 'A slow walk or gentle stretch, only if it feels good.',
        detail: {
          title: 'Gentle movement on Flow Days',
          items: [
            { name: 'A 10 to 20 minute walk' },
            { name: 'Restorative or yin yoga' },
            { name: 'Light stretching or mobility' },
            { name: 'Rest fully', note: 'also a valid choice' },
          ],
          why: 'Light movement can ease cramps, but hard training may feel harder than usual. Honour that.',
        },
      },
    ],
    predictedMood: 'calm',
    predictedEnergy: 'low',
  },
  follicular: {
    headline: 'You are coming back online. Energy, ideas, and optimism are all on the way up.',
    outlook: [
      { key: 'energy', label: 'Rising', trend: 'up' },
      { key: 'mood', label: 'Bright', trend: 'up' },
      { key: 'focus', label: 'Sharp', trend: 'up' },
      { key: 'social', label: 'Open', trend: 'up' },
    ],
    why: 'Estrogen is climbing again, lifting mood, focus, and your appetite for new things.',
    validation: 'Feeling good? Soak it in. Off? That is okay too. Both are useful to know.',
    suggestions: [
      {
        icon: 'mind',
        label: 'Do',
        text: 'A good day to start the thing you have been putting off.',
        detail: {
          title: 'Make the most of Glow Week',
          items: [
            { name: 'Start that project', note: 'momentum is on your side' },
            { name: 'Book the hard conversation' },
            { name: 'Learn something new', note: 'your brain loves novelty now' },
            { name: 'Plan and set goals' },
          ],
          why: 'Rising estrogen sharpens focus and memory and lifts your appetite for new things.',
        },
      },
      {
        icon: 'move',
        label: 'Move',
        text: 'Strength or a harder workout. Your body recovers well now.',
        detail: {
          title: 'Move in Glow Week',
          items: [
            { name: 'Strength training or lifting', note: 'great recovery now' },
            { name: 'A new class or HIIT' },
            { name: 'Go for a personal best' },
            { name: 'Longer runs or cardio' },
          ],
          why: 'Estrogen supports muscle building and recovery, and your pain tolerance runs higher.',
        },
      },
      {
        icon: 'eat',
        label: 'Eat',
        text: 'Fresh, seasonal food to match the rising energy.',
        detail: {
          title: 'What to eat in Glow Week',
          items: [
            { name: 'Seasonal fruit (papaya, guava)', note: 'antioxidants' },
            { name: 'Curd / dahi', note: 'gut + hormone balance' },
            { name: 'Moong sprouts' },
            { name: 'Palak & leafy greens' },
            { name: 'Flax & pumpkin seeds (alsi)' },
            { name: 'Paneer, dal or eggs', note: 'protein for the energy' },
          ],
          why: 'Fresh, fibre-rich food supports the rising estrogen and keeps your energy steady.',
        },
      },
    ],
    predictedMood: 'energized',
    predictedEnergy: 'high',
  },
  ovulation: {
    headline: 'You are at your brightest. If there is a big thing to say or do, today is the day.',
    outlook: [
      { key: 'energy', label: 'Peak', trend: 'peak' },
      { key: 'mood', label: 'Confident', trend: 'peak' },
      { key: 'focus', label: 'Clear', trend: 'up' },
      { key: 'social', label: 'High', trend: 'peak' },
    ],
    why: 'Estrogen peaks with a testosterone nudge, so confidence and social energy peak too.',
    validation: 'Big energy and big feelings both fit today. Tell me how it really lands.',
    suggestions: [
      {
        icon: 'mind',
        label: 'Say it',
        text: 'The conversation or pitch you keep postponing feels easiest now.',
        detail: {
          title: 'Use your Peak Days',
          items: [
            { name: 'Have the conversation you have postponed' },
            { name: 'Pitch the idea or ask for the thing' },
            { name: 'Schedule dates or social plans' },
            { name: 'Do the presentation or interview' },
          ],
          why: 'Estrogen peaks with a testosterone nudge, so verbal fluency and confidence peak with it.',
        },
      },
      {
        icon: 'move',
        label: 'Move',
        text: 'Channel the energy: a class, a long workout, a dance.',
        detail: {
          title: 'Move on Peak Days',
          items: [
            { name: 'A dance or group class' },
            { name: 'A long or intense workout' },
            { name: 'Team sports' },
            { name: 'Anything social and active' },
          ],
          why: 'Energy and confidence are at their highest. This is a great window to channel it.',
        },
      },
      {
        icon: 'eat',
        label: 'Eat',
        text: 'Light, fresh, and plenty of water to feel your best.',
        detail: {
          title: 'What to eat on Peak Days',
          items: [
            { name: 'Cucumber & watermelon (kakdi, tarbooz)', note: 'light + hydrating' },
            { name: 'Coconut water (nariyal paani)' },
            { name: 'Seasonal fruit & salad' },
            { name: 'Millets (jowar, bajra, ragi)', note: 'fibre helps clear estrogen' },
            { name: 'Plenty of water or nimbu paani' },
          ],
          why: 'With estrogen high, fibre and water help your body process hormones and feel its best.',
        },
      },
    ],
    predictedMood: 'happy',
    predictedEnergy: 'high',
  },
  luteal: {
    headline: 'Things are winding down. Be on your own team this week. You have earned the softness.',
    outlook: [
      { key: 'energy', label: 'Dipping', trend: 'down' },
      { key: 'mood', label: 'Sensitive', trend: 'down' },
      { key: 'focus', label: 'Foggy', trend: 'down' },
      { key: 'social', label: 'Quiet', trend: 'down' },
    ],
    why: 'Progesterone rises then drops, and serotonin dips with it. That is what brings the PMS and cravings.',
    validation: 'If you are low or on edge, it is the hormones talking, not you.',
    suggestions: [
      {
        icon: 'eat',
        label: 'Eat',
        text: 'Steady carbs and magnesium: roti, banana, nuts.',
        detail: {
          title: 'What to eat in The Dip',
          items: [
            { name: 'Whole grains (roti, brown rice, oats)', note: 'steady blood sugar' },
            { name: 'Sweet potato (shakarkandi)' },
            { name: 'Banana (kela)', note: 'magnesium + B6' },
            { name: 'Almonds & seeds (til, pumpkin)', note: 'magnesium' },
            { name: 'Dark chocolate', note: 'magnesium' },
            { name: 'Palak & leafy greens' },
          ],
          why: 'Falling serotonin drives sugar cravings. Steady carbs and magnesium keep mood and blood sugar even.',
        },
      },
      {
        icon: 'rest',
        label: 'Protect',
        text: 'Lighten the schedule where you can. Say no without guilt.',
        detail: {
          title: 'Protect your energy in The Dip',
          items: [
            { name: 'Move or drop one commitment' },
            { name: 'Say no without guilt' },
            { name: 'Earlier nights', note: 'sleep gets lighter now' },
            { name: 'A comfort that actually helps', note: 'bath, friend, warm meal' },
          ],
          why: 'Progesterone drops and serotonin dips, so guarding your energy is self-respect, not laziness.',
        },
      },
      {
        icon: 'move',
        label: 'Move',
        text: 'Gentle movement lifts mood and eases bloating.',
        detail: {
          title: 'Move gently in The Dip',
          items: [
            { name: 'Walks' },
            { name: 'Yoga or pilates' },
            { name: 'Lighter strength' },
            { name: 'Stretching', note: 'eases bloating' },
          ],
          why: 'Gentle movement lifts mood and eases bloating without draining you.',
        },
      },
    ],
    predictedMood: 'flat',
    predictedEnergy: 'low',
  },
};

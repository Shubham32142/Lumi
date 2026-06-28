// Phase-based educational content. Plain English, short reads, expandable.
// This is the "education + why" layer that sets the app apart from pure trackers.
import type { Phase } from '@/lib/types';

export type Category = 'hormones' | 'eat' | 'move' | 'sleep' | 'emotional' | 'doctor';

export interface CategoryMeta {
  key: Category;
  label: string;
  emoji: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { key: 'hormones', label: "What's happening", emoji: '🧬' },
  { key: 'eat', label: 'What to eat', emoji: '🍎' },
  { key: 'move', label: 'Movement', emoji: '🏃' },
  { key: 'sleep', label: 'Sleep & rest', emoji: '😴' },
  { key: 'emotional', label: 'Mind & mood', emoji: '💆' },
  { key: 'doctor', label: 'See a doctor if…', emoji: '⚠️' },
];

export interface Article {
  id: string;
  phase: Phase;
  category: Category;
  title: string;
  summary: string;
  body: string[]; // paragraphs, shown when expanded
  readTimeMinutes: number;
}

/** Punchy one-liners for the Today phase card ("why am I feeling this?"). */
export const PHASE_WHY: Record<Phase, string[]> = {
  menstruation: [
    'Estrogen and progesterone are at rock bottom — that low-energy, want-to-cocoon feeling is hormonal, not laziness.',
    'Cramps are your uterus literally contracting to shed its lining. Prostaglandins are the culprit.',
  ],
  follicular: [
    'Estrogen is rising again — hello, energy, optimism, and fresh ideas.',
    'Your brain is primed for learning and trying new things right now. Use it. ✨',
  ],
  ovulation: [
    'Estrogen peaks and testosterone gives a little nudge — confidence and social battery are maxed.',
    'This is your most outgoing, magnetic few days. Schedule the big stuff here. 💫',
  ],
  luteal: [
    'Progesterone rises then drops hard before your period — that drop is what triggers classic PMS.',
    'Serotonin dips with it, which is why mood and sugar cravings hit. Your brain wants a quick fix.',
  ],
};

export const ARTICLES: Article[] = [
  // ── Menstruation / Flow Days 🩸 ──
  {
    id: 'flow-hormones',
    phase: 'menstruation',
    category: 'hormones',
    title: 'Why am I so wiped out?',
    summary: 'Both estrogen and progesterone are at their lowest — your body is conserving energy.',
    body: [
      'Day 1 of your period is the lowest-hormone day of the whole month. With estrogen and progesterone both bottomed out, energy, motivation, and even body temperature dip.',
      'This is a feature, not a flaw. Think of it as your body asking for a softer pace. Rest now actually pays off later in the month.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'flow-eat',
    phase: 'menstruation',
    category: 'eat',
    title: 'Eat for your iron',
    summary: 'You lose iron when you bleed — top it up with leafy greens, lentils, and a little vitamin C.',
    body: [
      'Bleeding means losing iron, which can add to that tired, foggy feeling. Iron-rich foods (spinach, beans, lentils, red meat if you eat it) help.',
      'Pair them with vitamin C (citrus, peppers, strawberries) to absorb more. Warm, cooked foods tend to feel better than cold/raw right now.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'flow-move',
    phase: 'menstruation',
    category: 'move',
    title: 'Gentle is the move',
    summary: 'Walking, stretching, and light yoga can ease cramps without draining you.',
    body: [
      'You do not have to "push through." Light movement boosts circulation and can genuinely reduce cramps, but intense training may feel harder than usual — and that is normal.',
      'Try a walk, gentle yoga, or mobility work. If you feel up for more, great. If not, also great.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'flow-doctor',
    phase: 'menstruation',
    category: 'doctor',
    title: 'When heavy is too heavy',
    summary: 'Soaking a pad/tampon every hour, clots bigger than a coin, or periods over 7 days are worth a check.',
    body: [
      'Periods vary a lot, but a few things are worth flagging to a doctor: soaking through a pad or tampon every hour for several hours, passing clots larger than a coin, bleeding longer than 7 days, or pain that stops you functioning.',
      'This is not about scaring you — it is about knowing your normal so you notice when something changes.',
    ],
    readTimeMinutes: 1,
  },

  // ── Follicular / Glow Week ✨ ──
  {
    id: 'glow-hormones',
    phase: 'follicular',
    category: 'hormones',
    title: 'Why do I suddenly feel great?',
    summary: 'Rising estrogen lifts mood, energy, and focus as your body preps to ovulate.',
    body: [
      'After your period, estrogen climbs steadily. It boosts serotonin and dopamine, sharpens memory, and makes you feel more open and motivated.',
      'This is a natural high point. Many people feel more creative and social — a good window for starting things.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'glow-move',
    phase: 'follicular',
    category: 'move',
    title: 'Go hard (if you want to)',
    summary: 'Strength and high-intensity workouts often feel easiest now — your body recovers well.',
    body: [
      'Rising estrogen supports muscle building and recovery, and your pain tolerance tends to be higher. If you like intense training, this and Peak Days are usually your strongest window.',
      'Progressive overload, a new class, a personal best — this is the time to chase it.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'glow-emotional',
    phase: 'follicular',
    category: 'emotional',
    title: 'Ride the momentum',
    summary: 'Use the optimism to plan, learn, and tackle the things that felt hard last week.',
    body: [
      'Your brain is wired for novelty and learning right now. Tasks that felt impossible in The Dip can feel doable — even fun.',
      'Front-load hard conversations, big decisions, and creative work into this window when you can.',
    ],
    readTimeMinutes: 1,
  },

  // ── Ovulation / Peak Days 💫 ──
  {
    id: 'peak-hormones',
    phase: 'ovulation',
    category: 'hormones',
    title: 'Why am I so social right now?',
    summary: 'Estrogen peaks (with a testosterone bump) — confidence, libido, and charisma spike.',
    body: [
      'Around ovulation, estrogen hits its highest point and testosterone rises briefly. Translation: you may feel more confident, talkative, attractive, and up for connection.',
      'It is short — usually a few days. A great window for dates, presentations, networking, or anything that needs you "on".',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'peak-eat',
    phase: 'ovulation',
    category: 'eat',
    title: 'Light, fresh, and hydrating',
    summary: 'Fiber and antioxidants support estrogen clearing; plenty of water helps you feel your best.',
    body: [
      'With estrogen high, fiber-rich veg, fruit, and whole grains help your body process and clear hormones smoothly.',
      'You may naturally want lighter, fresher meals now — lean into it, and keep water handy.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'peak-emotional',
    phase: 'ovulation',
    category: 'emotional',
    title: 'Say the big thing',
    summary: 'Communication flows easiest now — a good time for the conversation you keep postponing.',
    body: [
      'Verbal fluency and confidence peak here. If there is a conversation, ask, or pitch you have been putting off, this is often the easiest time to do it.',
    ],
    readTimeMinutes: 1,
  },

  // ── Luteal / The Dip 🌧️ ──
  {
    id: 'dip-hormones',
    phase: 'luteal',
    category: 'hormones',
    title: 'Why do I feel anxious and off?',
    summary: 'Progesterone rises then drops, and serotonin dips with it — the classic PMS setup.',
    body: [
      'After ovulation, progesterone rises to calm the body, then falls sharply if no pregnancy occurs. That drop, plus a serotonin dip, is what drives irritability, low mood, anxiety, and tearfulness.',
      'It is real brain chemistry, not you "being dramatic". Knowing the timing helps you plan around it.',
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'dip-eat',
    phase: 'luteal',
    category: 'eat',
    title: 'Why do I crave sugar before my period?',
    summary: 'Falling serotonin makes your brain reach for quick fixes — steady carbs and magnesium help more.',
    body: [
      'When serotonin drops, your brain looks for a fast mood boost — hello, sugar and carbs. The spike-and-crash usually makes things worse.',
      'Complex carbs (oats, whole grains), magnesium (dark chocolate, nuts, leafy greens), and protein keep blood sugar — and mood — steadier. You do not have to be perfect; just aim for steady.',
    ],
    readTimeMinutes: 2,
  },
  {
    id: 'dip-move',
    phase: 'luteal',
    category: 'move',
    title: 'Dial it back a notch',
    summary: 'Energy fades through this phase — swap some intensity for walks, yoga, and strength you enjoy.',
    body: [
      'As progesterone rises and then drops, you may tire faster and feel workouts are harder. That is expected.',
      'Gentle movement still lifts mood and eases bloating. Honor lower energy instead of fighting it.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'dip-sleep',
    phase: 'luteal',
    category: 'sleep',
    title: 'Why is my sleep worse this week?',
    summary: 'The progesterone drop and a slightly higher body temperature can fragment sleep — cool, dark, consistent helps.',
    body: [
      'Body temperature runs a touch higher in the luteal phase, and the hormone shifts can make sleep lighter. A cooler room, dimmer evenings, and a consistent bedtime make a real difference.',
      'Caffeine clears slower when you are stressed — an earlier cut-off can help the PMS-week wakefulness.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'dip-emotional',
    phase: 'luteal',
    category: 'emotional',
    title: 'Be on your own team',
    summary: 'Lower the bar, protect your energy, and treat the feelings as weather that will pass.',
    body: [
      'This is the week to be kind to yourself. Reduce optional commitments, say no without guilt, and lean on comfort that actually helps you (a bath, a friend, a warm meal).',
      'The feelings are real, but they are also temporary and hormonally timed. They lift when your period starts.',
    ],
    readTimeMinutes: 1,
  },
  {
    id: 'dip-doctor',
    phase: 'luteal',
    category: 'doctor',
    title: 'PMS vs. PMDD — when to ask for help',
    summary: 'If low mood, rage, or hopelessness each month seriously disrupts your life, that may be PMDD — worth a conversation.',
    body: [
      'Most people get some PMS. But if every luteal phase brings severe depression, anxiety, anger, or hopelessness that damages your relationships, work, or safety, that pattern may be PMDD (premenstrual dysphoric disorder).',
      'It is recognized and treatable. Tracking your symptoms here for a couple of cycles gives a doctor exactly what they need. If you ever feel unsafe, reach out to a professional right away.',
    ],
    readTimeMinutes: 2,
  },
];

export function articlesByPhase(phase: Phase): Article[] {
  return ARTICLES.filter((a) => a.phase === phase);
}

export function categoryMeta(key: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.key === key)!;
}

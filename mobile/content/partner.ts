// "How to support her today" tips shown in Partner Mode, per phase.
import type { Phase } from '@/lib/types';

export const PARTNER_TIPS: Record<Phase, string[]> = {
  menstruation: [
'Energy is low and cramps may be real. Offer comfort, not fixes. A heat pack, water, or her favorite snack lands well.',
    "Don't plan anything demanding today. A cozy, low-key day is the gift.",
    'A simple "what would feel good right now?" beats guessing.',
  ],
  follicular: [
"She's likely feeling upbeat and capable. It's a great time for plans, projects, or trying something new together.",
    "Match her momentum. Suggest the trip, the date, the idea you've been sitting on.",
    "Good time for deeper conversations. She's open and energized.",
  ],
  ovulation: [
'Confidence and social energy are peaking. She may be at her most outgoing and affectionate.',
    "Plan something fun and social, or a standout date. She's up for it.",
    'A genuine compliment goes a long way right now.',
  ],
  luteal: [
"PMS week. She may need more reassurance than usual. Try not to take mood changes personally.",
    'A warm meal, her comfort show, or just patience helps more than advice.',
    'Pick up a little extra without being asked. It really registers this week.',
  ],
};

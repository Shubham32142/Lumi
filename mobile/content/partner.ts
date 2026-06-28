// The supporter guide, per phase. Not just "be nice" — it teaches the partner
// what is actually happening to her and why, gives concrete things to do today,
// flags the common mistakes, and explains why understanding this helps them both.
import type { Phase } from '@/lib/types';

export interface PartnerAction {
  text: string; // the action
  detail?: string; // concrete specifics
}

export interface PartnerGuide {
  whatsHappening: string; // supporter-framed: what is happening to her and why
  support: PartnerAction[]; // concrete things to do today
  avoid: string[]; // common mistakes to skip
  relationship: string; // why understanding this helps you both
}

export const PARTNER_GUIDE: Record<Phase, PartnerGuide> = {
  menstruation: {
    whatsHappening:
      "She is on her period. Estrogen and progesterone are at their lowest, so energy, motivation, and even body temperature dip. Wanting to slow down and cocoon is hormonal, not her pulling away from you.",
    support: [
      { text: 'Take a chore off her plate, unasked', detail: 'dishes, dinner, the errand — just pick one' },
      { text: 'Bring warmth and comfort', detail: 'a heat pack for cramps, a warm drink, her favourite snack' },
      { text: 'Keep the day low-key', detail: 'no big plans; the sofa and a film is a real gift' },
      { text: 'Ask, do not guess', detail: '"what would feel good right now?" beats assuming' },
    ],
    avoid: [
      'Trying to fix her mood or her cramps. Offer comfort, not solutions.',
      'Planning anything demanding or heavily social today.',
      'Reading low energy as rejection.',
    ],
    relationship:
      'Showing up gently on her hardest days is what she remembers. That safety builds deep trust and makes the whole month easier for both of you.',
  },
  follicular: {
    whatsHappening:
      'Her period is over and estrogen is climbing. Energy, mood, focus, and her appetite for new things are all on the way up. She is coming back to life.',
    support: [
      { text: 'Say yes to her ideas', detail: 'the trip, the project, the plan she is excited about' },
      { text: 'Make a plan together', detail: 'a great week to start something or finally book that thing' },
      { text: 'Have the deeper conversation', detail: 'she is open, optimistic, and up for it now' },
    ],
    avoid: [
      'Dampening her momentum or shooting down ideas.',
      'Leaving all the planning to her. Match her energy.',
    ],
    relationship:
      'Meeting her enthusiasm now builds shared excitement and memories. It tells her you are in it together, not just along for the ride.',
  },
  ovulation: {
    whatsHappening:
      'She is ovulating. Estrogen peaks with a testosterone nudge, so confidence, social energy, and libido peak too. She is at her most outgoing and magnetic.',
    support: [
      { text: 'Plan something social or a standout date', detail: 'she is up for people, fun, and connection' },
      { text: 'Give a genuine compliment', detail: 'it lands especially well right now' },
      { text: 'Be present and engaged', detail: 'she is drawn to connection; meet her there' },
    ],
    avoid: [
      'Keeping things low-key when she wants to engage.',
      'Missing the window for the big conversation or the romantic gesture.',
    ],
    relationship:
      'Leaning into her brightest, most social days creates the high points you both look back on. It keeps the spark alive and her feeling wanted.',
  },
  luteal: {
    whatsHappening:
      'She is in the week or so before her period. Progesterone rises then drops, and serotonin dips with it. That drop drives PMS: irritability, low mood, anxiety, cravings. It is brain chemistry, not her being difficult, and it lifts when her period starts.',
    support: [
      { text: 'Offer extra reassurance and patience', detail: 'she may need to hear you are not upset and you are here' },
      { text: 'Quietly pick up the slack', detail: 'do a little extra without being asked. it really registers' },
      { text: 'Bring comfort food that helps', detail: 'dark chocolate, nuts, a warm carby meal ease the dip' },
      { text: 'Protect her calm', detail: 'lighten the social load, dim the evenings, let her rest' },
    ],
    avoid: [
      'Taking mood changes personally or arguing the feelings.',
      'Saying "is it that time of the month?" — it dismisses her.',
      'Adding pressure or big asks this week.',
    ],
    relationship:
      'How you handle her hardest week defines how safe she feels with you. Patience now, instead of defensiveness, prevents most PMS-week conflicts and deepens her trust.',
  },
};

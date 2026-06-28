import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { CycleLog } from '@/models/CycleLog';
import { getUserId } from '@/lib/auth';
import { predict, type Phase } from '@/lib/cycle';

const TIPS: Record<Phase, string[]> = {
  menstruation: [
    'Energy is low and cramps may be real — offer comfort, not fixes. A heat pack or her favorite snack lands well. 🫶',
    'Keep today low-key. A cozy vibe is the gift.',
  ],
  follicular: [
    "She's likely feeling upbeat — a great time for plans or trying something new together. ✨",
    "Match her momentum: suggest the trip or idea you've been sitting on.",
  ],
  ovulation: [
    'Confidence and social battery are peaking — she may be at her most outgoing. 💫',
    'Plan something fun and social, or a standout date.',
  ],
  luteal: [
    "PMS week: she may need more reassurance than usual. Don't take mood changes personally. 💜",
    'A warm meal, her comfort show, or just patience helps more than advice.',
  ],
};

// GET /api/partner — the partner-visible snapshot for the signed-in user
// (preview of "what your partner sees"). Per-category sharing is enforced
// client-side in v1; standalone partner-account login is a follow-up.
export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  const user = await User.findById(userId).lean<{
    cycleLength: number;
    periodLength: number;
    lastPeriodDate: string | null;
  } | null>();
  if (!user) return Response.json({ error: 'User not found.' }, { status: 404 });

  const p = predict({
    lastPeriodDate: user.lastPeriodDate ?? null,
    cycleLength: user.cycleLength ?? 28,
    periodLength: user.periodLength ?? 5,
  });

  const today = new Date().toISOString().slice(0, 10);
  const log = await CycleLog.findOne({ userId, date: today }).lean<{
    mood?: string;
    energy?: string;
  } | null>();

  return Response.json({
    phase: p.phase,
    dayOfCycle: p.dayOfCycle,
    today: { mood: log?.mood ?? null, energy: log?.energy ?? null },
    tips: p.phase ? TIPS[p.phase] : [],
  });
}

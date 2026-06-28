import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { CycleLog } from '@/models/CycleLog';
import { getUserId } from '@/lib/auth';
import { checkRate } from '@/lib/rateLimit';

// DELETE /api/account — permanently remove the signed-in user and all their
// synced data (profile + every cycle log). Irreversible.
export async function DELETE(req: Request) {
  const limited = checkRate(req, 'account', 20, 60 * 1000); // 20 per min / IP
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  await CycleLog.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
  return Response.json({ ok: true });
}

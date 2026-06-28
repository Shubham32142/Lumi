import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserId } from '@/lib/auth';

type AnyRecord = Record<string, unknown>;

// POST /api/partner/unlink — a supporter unlinks themselves from the owner.
export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  const me = await User.findById(userId).lean<AnyRecord | null>();
  if (me?.partnerOf) {
    await User.findByIdAndUpdate(me.partnerOf, { $pull: { partners: userId } });
    await User.findByIdAndUpdate(userId, { $set: { partnerOf: null } });
  }
  return Response.json({ ok: true });
}

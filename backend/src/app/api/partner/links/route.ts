import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserId } from '@/lib/auth';

type AnyRecord = Record<string, unknown>;

// GET /api/partner/links — the owner lists her linked supporters so she can revoke.
export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  const me = await User.findById(userId).lean<AnyRecord | null>();
  const ids = ((me?.partners as unknown[]) ?? []).map(String);
  const supporters = ids.length
    ? await User.find({ _id: { $in: ids } }).select('email').lean<AnyRecord[]>()
    : [];
  return Response.json({
    partners: supporters.map((s: AnyRecord) => ({ id: String(s._id), email: s.email })),
  });
}

// DELETE /api/partner/links — the owner removes a supporter. Body: { partnerId }
export async function DELETE(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: { partnerId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.partnerId) return Response.json({ error: 'Missing partnerId.' }, { status: 400 });

  await connectDB();
  await User.findByIdAndUpdate(userId, { $pull: { partners: body.partnerId } });
  await User.findByIdAndUpdate(body.partnerId, { $set: { partnerOf: null } });
  return Response.json({ ok: true });
}

import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserId } from '@/lib/auth';
import { checkRate } from '@/lib/rateLimit';
import { buildSnapshot } from '@/lib/partnerSnapshot';

type AnyRecord = Record<string, unknown>;

// POST /api/partner/link — the signed-in user (a supporter) links to an owner by
// her invite code. Rate-limited to make codes impractical to brute force.
export async function POST(req: Request) {
  const limited = checkRate(req, 'partner-link', 12, 60 * 1000); // 12/min/IP
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const code = (body.code ?? '').trim().toUpperCase();
  if (!code) return Response.json({ error: 'Enter the code your partner shared.' }, { status: 400 });

  await connectDB();
  const owner = await User.findOne({ 'partnerSharing.inviteCode': code }).lean<AnyRecord | null>();
  if (!owner) {
    return Response.json({ error: "That code didn't match anyone. Double-check it." }, { status: 404 });
  }
  const sharing = (owner.partnerSharing ?? {}) as AnyRecord;
  if (!sharing.enabled) {
    return Response.json(
      { error: 'That person has not turned on partner sharing yet.' },
      { status: 403 },
    );
  }
  const ownerId = String(owner._id);
  if (ownerId === userId) {
    return Response.json({ error: "That's your own code." }, { status: 400 });
  }

  // Move the supporter's link to this owner (and off any previous owner).
  const me = await User.findById(userId).lean<AnyRecord | null>();
  if (me?.partnerOf && String(me.partnerOf) !== ownerId) {
    await User.findByIdAndUpdate(me.partnerOf, { $pull: { partners: userId } });
  }
  await User.findByIdAndUpdate(userId, { $set: { partnerOf: owner._id } });
  await User.findByIdAndUpdate(ownerId, { $addToSet: { partners: userId } });

  const snapshot = await buildSnapshot(ownerId);
  return Response.json({ ok: true, snapshot });
}

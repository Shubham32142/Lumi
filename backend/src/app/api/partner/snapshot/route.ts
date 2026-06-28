import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserId } from '@/lib/auth';
import { checkRate } from '@/lib/rateLimit';
import { buildSnapshot } from '@/lib/partnerSnapshot';

type AnyRecord = Record<string, unknown>;

// GET /api/partner/snapshot — a supporter fetches the latest from the person they
// support. Consent is enforced inside buildSnapshot.
export async function GET(req: Request) {
  const limited = checkRate(req, 'partner-snapshot', 120, 60 * 1000);
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  const me = await User.findById(userId).lean<AnyRecord | null>();
  if (!me?.partnerOf) return Response.json({ linked: false });

  const snapshot = await buildSnapshot(String(me.partnerOf));
  if (!snapshot) return Response.json({ linked: false });
  return Response.json(snapshot);
}

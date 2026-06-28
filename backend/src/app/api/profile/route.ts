import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { getUserId } from '@/lib/auth';
import { checkRate } from '@/lib/rateLimit';

// Profile fields the client owns. email/passwordHash/_id are never accepted here.
const PROFILE_FIELDS = [
  'experienceLevel',
  'ageRange',
  'cycleLength',
  'periodLength',
  'lastPeriodDate',
  'isIrregular',
  'trackedSymptoms',
  'notificationPrefs',
  'partnerSharing',
] as const;

type AnyRecord = Record<string, unknown>;

function shape(doc: AnyRecord) {
  const profile: AnyRecord = {};
  for (const f of PROFILE_FIELDS) profile[f] = doc[f];
  return {
    profile,
    periodStarts: doc.periodStarts ?? [],
    bookmarks: doc.bookmarks ?? [],
  };
}

// GET /api/profile — the signed-in user's synced profile.
export async function GET(req: Request) {
  const limited = checkRate(req, 'profile', 120, 60 * 1000);
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  await connectDB();
  const user = await User.findById(userId).lean<AnyRecord | null>();
  if (!user) return Response.json({ error: 'User not found.' }, { status: 404 });
  return Response.json(shape(user));
}

// PUT /api/profile — update profile / periodStarts / bookmarks (whitelisted).
export async function PUT(req: Request) {
  const limited = checkRate(req, 'profile', 120, 60 * 1000);
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: { profile?: AnyRecord; periodStarts?: string[]; bookmarks?: string[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const set: AnyRecord = {};
  if (body.profile) {
    for (const f of PROFILE_FIELDS) {
      if (body.profile[f] !== undefined) set[f] = body.profile[f];
    }
  }
  if (Array.isArray(body.periodStarts)) set.periodStarts = body.periodStarts;
  if (Array.isArray(body.bookmarks)) set.bookmarks = body.bookmarks;

  await connectDB();
  const user = await User.findByIdAndUpdate(userId, { $set: set }, { new: true }).lean<AnyRecord | null>();
  if (!user) return Response.json({ error: 'User not found.' }, { status: 404 });
  return Response.json(shape(user));
}

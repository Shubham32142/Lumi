import { connectDB } from '@/lib/db';
import { CycleLog } from '@/models/CycleLog';
import { getUserId } from '@/lib/auth';
import { checkRate } from '@/lib/rateLimit';

// GET /api/logs?from=YYYY-MM-DD&to=YYYY-MM-DD — list the signed-in user's logs.
export async function GET(req: Request) {
  const limited = checkRate(req, 'logs', 120, 60 * 1000); // 120 per min / IP
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const query: Record<string, unknown> = { userId };
  if (from || to) {
    query.date = {
      ...(from ? { $gte: from } : {}),
      ...(to ? { $lte: to } : {}),
    };
  }

  await connectDB();
  const logs = await CycleLog.find(query).sort({ date: -1 }).lean();
  return Response.json({ logs });
}

// POST /api/logs — upsert a single day's log (body: { date, ...fields }).
export async function POST(req: Request) {
  const limited = checkRate(req, 'logs', 120, 60 * 1000); // 120 per min / IP
  if (limited) return limited;
  const userId = await getUserId(req);
  if (!userId) return Response.json({ error: 'Not authenticated.' }, { status: 401 });

  let body: { date?: string } & Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return Response.json({ error: 'A valid `date` (YYYY-MM-DD) is required.' }, { status: 400 });
  }

  const { date, ...fields } = body;
  delete (fields as Record<string, unknown>).userId; // never let the client set ownership

  await connectDB();
  const log = await CycleLog.findOneAndUpdate(
    { userId, date },
    { $set: { ...fields, userId, date, updatedAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  return Response.json({ log });
}

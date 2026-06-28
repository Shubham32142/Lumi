import { predict, type PredictInput } from '@/lib/cycle';

// POST /api/cycle/predict — stateless prediction.
// Body: { lastPeriodDate, cycleLength, periodLength, onDate? }
export async function POST(req: Request) {
  let body: PredictInput & { onDate?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const input: PredictInput = {
    lastPeriodDate: body.lastPeriodDate ?? null,
    cycleLength: Number(body.cycleLength) || 28,
    periodLength: Number(body.periodLength) || 5,
  };

  return Response.json(predict(input, body.onDate));
}

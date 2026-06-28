// Lightweight per-IP rate limiting.
//
// IMPORTANT: this is an in-memory, *best-effort* limiter. On serverless (Vercel)
// each instance has its own memory, so it throttles bursts hitting a warm
// instance but is not a hard global guarantee. For production-grade limits put
// Vercel Firewall rules in front of the app, and/or back this with a shared
// store (e.g. Upstash Redis). It still raises the bar against casual spam for free.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Pull the caller's IP from the proxy headers Vercel sets. */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Fixed-window limiter. Returns a 429 Response when the limit is exceeded for
 * this (name + IP) within the window, or null to continue.
 */
export function checkRate(
  req: Request,
  name: string,
  limit: number,
  windowMs: number,
): Response | null {
  const key = `${name}:${clientIp(req)}`;
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded on a long-lived instance.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  b.count += 1;
  if (b.count > limit) {
    const retryAfter = Math.ceil((b.resetAt - now) / 1000);
    return Response.json(
      { error: 'Too many requests. Please slow down and try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }
  return null;
}

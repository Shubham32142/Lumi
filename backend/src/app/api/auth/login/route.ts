import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';
  if (!email || !password) {
    return Response.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    // Same message for both cases — don't leak which emails exist.
    return Response.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  const token = signToken({ userId: String(user._id) });
  await setAuthCookie(token);
  return Response.json({ token, userId: String(user._id) });
}

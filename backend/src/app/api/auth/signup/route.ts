import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? '';
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email.' }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  await connectDB();
  const existing = await User.findOne({ email }).lean();
  if (existing) {
    return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });

  const token = signToken({ userId: String(user._id) });
  await setAuthCookie(token);
  return Response.json({ token, userId: String(user._id) }, { status: 201 });
}

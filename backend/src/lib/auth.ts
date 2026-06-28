// Auth helpers: bcrypt (salt rounds 12) + JWT in an httpOnly cookie.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SALT_ROUNDS = 12;
const COOKIE_NAME = 'cycle_token';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret(): string {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set. Add it to .env.local');
  return s;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: { userId: string }): string {
  return jwt.sign(payload, secret(), { expiresIn: MAX_AGE });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, secret()) as { userId: string };
  } catch {
    return null;
  }
}

/** Write the auth cookie (httpOnly, sameSite lax, secure in prod). */
export async function setAuthCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/**
 * Resolve the current user id from either the httpOnly cookie or a
 * `Authorization: Bearer <token>` header (used by the mobile app).
 */
export async function getUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const decoded = verifyToken(auth.slice(7));
    if (decoded) return decoded.userId;
  }
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) return decoded.userId;
  }
  return null;
}

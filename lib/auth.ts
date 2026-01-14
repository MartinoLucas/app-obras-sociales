import { cookies } from 'next/headers';

const COOKIE = 'session';

export async function getSession(): Promise<string | null> {
  const jar = await cookies();        // Next 15: APIs async
  return jar.get(COOKIE)?.value ?? null;
}

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, userId, { httpOnly: true, sameSite: 'lax', path: '/' });
}

export async function clearSession() {
  const jar = await cookies();
  jar.set(COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' });
}

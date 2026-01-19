import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';
import { setSession, clearSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
  }
  const user = await prisma.professional.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user) return NextResponse.json({ error: 'Credenciales' }, { status: 401 });

  const ok = await compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: 'Credenciales' }, { status: 401 });

  if (user.status !== 'approved') {
    return NextResponse.json({ error: 'Pendiente de aprobación' }, { status: 403 });
  }

  await setSession(user.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}

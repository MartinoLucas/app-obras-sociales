// app/api/enrollment/route.ts
import { NextResponse } from 'next/server';
import { EnrollmentService } from '@/services/enrollmentService';
import { PrismaEnrollmentRepo } from '@/infra/repositories/prismaEnrollmentRepo';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const { kind } = await req.json();
  const proId = await getSession();
  if (!proId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const service = new EnrollmentService(new PrismaEnrollmentRepo());
  try {
    if (kind === 'enroll') await service.enroll(proId);
    else if (kind === 'unenroll') await service.unenroll(proId);
    else return NextResponse.json({ error: 'kind inválido' }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

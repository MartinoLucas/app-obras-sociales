import { NextResponse } from 'next/server';
import { PrismaEnrollmentRepo } from '@/infra/repositories/prismaEnrollmentRepo';
import { DocumentService } from '@/services/documentService';
import { getSession } from '@/lib/auth';
import { LocalStorageAdapter } from '@/infra/storage/localStorageAdapter';
import { PrismaDocumentRepo } from '@/infra/repositories/prismaDocumentRepo';

export const runtime = 'nodejs'; // para acceso a fs

export async function POST(req: Request) {
  const proId = await getSession();
  if (!proId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const form = await req.formData();
  const kind = String(form.get('kind'));
  const file = form.get('file');
  if (!(file instanceof Blob)) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 });

  const service = new DocumentService(new PrismaDocumentRepo(), new PrismaEnrollmentRepo(), new LocalStorageAdapter());
  try {
    await service.upload(proId, kind as any, file);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

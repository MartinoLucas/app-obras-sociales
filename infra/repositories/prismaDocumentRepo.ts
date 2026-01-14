import { prisma } from '../prisma/client';
import { IDocumentRepo } from '@/domain/ports/repositories';

export class PrismaDocumentRepo implements IDocumentRepo {
  async upsert(proId: string, kind: any, url: string) {
    await prisma.document.upsert({
      where: { professionalId_kind: { professionalId: proId, kind } },
      create: { professionalId: proId, kind, url },
      update: { url }
    });
  }
  list(proId: string) {
    return prisma.document.findMany({
      where: { professionalId: proId },
      select: { kind: true, url: true, uploadedAt: true }
    }) as any;
  }
}

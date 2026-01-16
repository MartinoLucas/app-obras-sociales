import prisma from '@/lib/prisma';
import { IEnrollmentRepo } from '@/domain/ports/repositories';

export class PrismaEnrollmentRepo implements IEnrollmentRepo {
  async addEnrollment(pId: string, year: number, month: number) {
    await prisma.enrollment.create({ data: { professionalId: pId, year, month, kind: 'enroll' } });
  }
  async addUnenrollment(pId: string, year: number, month: number) {
    await prisma.enrollment.create({ data: { professionalId: pId, year, month, kind: 'unenroll' } });
  }
  async firstEnrollmentDate(pId: string) {
    const first = await prisma.enrollment.findFirst({
      where: { professionalId: pId, kind: 'enroll' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    });
    return first?.createdAt ?? null;
  }
}

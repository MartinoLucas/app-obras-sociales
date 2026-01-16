import prisma from '@/lib/prisma';
import { IProfessionalRepo } from '@/domain/ports/repositories';

export class PrismaProfessionalRepo implements IProfessionalRepo {
  findByEmail(email: string) {
    return prisma.professional.findUnique({ where: { email } }) as any;
  }
  findById(id: string) {
    return prisma.professional.findUnique({ where: { id } }) as any;
  }
  async approve(id: string) {
    await prisma.professional.update({ where: { id }, data: { status: 'approved' } });
  }
  async upsert(p: any) {
    return prisma.professional.upsert({
      where: { id: p.id },
      create: p,
      update: p
    }) as any;
  }
}

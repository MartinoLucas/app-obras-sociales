'use server';

import prisma from '@/lib/prisma';

export async function activateProfessional(proId: string) {

  const exists = await prisma.professional.findFirst({ where: { id: proId } });
  if (!exists) return 'No existe un profesional con ese ID';

  await prisma.professional.update({
    where: { id: proId },
    data: { status: 'active' }
  });
}
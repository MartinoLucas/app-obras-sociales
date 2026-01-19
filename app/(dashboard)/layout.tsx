// app/(dashboard)/layout.tsx
// parcialmente comentado para trabajar de manera mas sencilla
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const jar = await cookies();
  // const id = jar.get('session')?.value;
  // if (!id) redirect('/login');

  // const p = await prisma.professional.findUnique({ where: { id } });
  // if (!p || p.status !== 'approved') redirect('/login');

  return <section className="container mx-auto p-6">{children}</section>;
}

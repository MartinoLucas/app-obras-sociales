import { NextResponse } from 'next/server';
import { isWithinWindow } from '@/domain/policies/enrollmentPolicy';
import { prisma } from '@/infra/prisma/client';
import { toCsv } from '@/infra/export/csvExportAdapter';

export async function GET(_: Request, { params }: { params: { scope: string }}) {
  const now = new Date();
  if (!isWithinWindow(now, 'export')) {
    return NextResponse.json({ error: 'Exportaciones del 26 al 30/31' }, { status: 403 });
  }
  const y = now.getFullYear(), m = now.getMonth()+1;

  let rows: any[] = [];
  if (params.scope === 'obra-social') {
    rows = await prisma.$queryRawUnsafe<any[]>(`
      SELECT os.nombre as obraSocial, l.nombre as localidad, p.apellido, p.nombre, p.matricula, e.year, e.month
      FROM Enrollment e
      JOIN Professional p ON p.id = e.professionalId
      JOIN ProfessionalObraSocial pos ON pos.professionalId = p.id
      JOIN ObraSocial os ON os.id = pos.obraSocialId
      JOIN Localidad l ON l.id = p.localidadId
      WHERE e.year = ${y} AND e.month = ${m} AND e.kind = 'enroll'
    `);
  } else if (params.scope === 'localidad') {
    rows = await prisma.$queryRawUnsafe<any[]>(`
      SELECT l.nombre as localidad, COUNT(*) as total
      FROM Enrollment e
      JOIN Professional p ON p.id = e.professionalId
      JOIN Localidad l ON l.id = p.localidadId
      WHERE e.year = ${y} AND e.month = ${m} AND e.kind = 'enroll'
      GROUP BY l.nombre
    `);
  } else if (params.scope === 'practica') {
    rows = await prisma.$queryRawUnsafe<any[]>(`
      SELECT pr.nombre as practica, os.nombre as obraSocial, p.apellido, p.nombre
      FROM Enrollment e
      JOIN Professional p ON p.id = e.professionalId
      JOIN ProfessionalObraSocial pos ON pos.professionalId = p.id
      JOIN ObraSocial os ON os.id = pos.obraSocialId
      JOIN Practice pr ON pr.obraSocialId = os.id
      WHERE e.year = ${y} AND e.month = ${m} AND e.kind = 'enroll'
    `);
  } else {
    return NextResponse.json({ error: 'scope inválido' }, { status: 400 });
  }

  const csv = await toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${params.scope}-${y}-${m}.csv"`
    }
  });
}

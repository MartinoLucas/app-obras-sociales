// app/(dashboard)/aceptacion-profesionales/page.tsx

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PendingTable } from "./pending-table"; // Importamos el cliente

export default async function AdminPage() {
  const userId = await getSession();

  // 1. Verificar sesión
  if (!userId) {
    redirect("/login");
  }
  
  // 2. Buscar al usuario admin
  const user = await prisma.professional.findUnique({
    where: { id: userId }
  });

  // 3. Verificar rol
  if (!user || user.role !== 'admin') {
    return redirect('/dashboard');
  }

  // 4. Buscar pendientes REALES en la DB
  const pendingPros = await prisma.professional.findMany({
    where: { status: 'pending' },
    select: { // Seleccionamos solo lo que necesita la tabla
      id: true,
      nombre: true,
      apellido: true,
      matricula: true,
      email: true,
      status: true
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      {/* 5. Pasamos los datos de la DB al componente Cliente */}
      <PendingTable data={pendingPros} />
    </div>
  );
}
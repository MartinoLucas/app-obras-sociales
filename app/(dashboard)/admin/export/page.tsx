// app/(dashboard)/admin/export/page.tsx
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExportControls } from "./export-controls"; // Componente Cliente

export default async function ExportPage() {
  const userId = await getSession();
  if (!userId) redirect("/login");
  
  const user = await prisma.professional.findUnique({ where: { id: userId } });

  if (!user || user.role !== 'admin') redirect('/dashboard');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Exportación de Datos</h1>
      <p className="text-gray-500 mb-8">
        Descarga de padrones y listados para Obras Sociales.
      </p>
      <ExportControls />
    </div>
  );
}
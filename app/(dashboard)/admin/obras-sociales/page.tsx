import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreateObraSocialForm } from "./create-form"; // Componente cliente

export default async function ObrasSocialesPage() {
  const userId = await getSession();
  if (!userId) redirect("/login");

  // Check Admin
  const user = await prisma.professional.findUnique({ where: { id: userId } });
  if (user?.role !== "admin") redirect("/dashboard");

  // Obtener lista actual
  const obras = await prisma.obraSocial.findMany({
    orderBy: { nombre: 'asc' },
    include: { _count: { select: { obras: true } } } // Contar cuantos profesionales la tienen
  });

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Obras Sociales</h1>
      </div>

      {/* Formulario de carga simple */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wide">Agregar Nueva</h2>
        <CreateObraSocialForm />
      </div>

      {/* Listado */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Inscriptos</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {obras.map((os) => (
              <tr key={os.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium">{os.nombre}</td>
                <td className="px-6 py-3 text-gray-500">{os._count.obras} prof.</td>
                <td className="px-6 py-3 text-right text-gray-400">
                  {/* Aquí podrías poner un botón de editar/borrar */}
                  ...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// app/(dashboard)/inscripcion/page.tsx

import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { AffiliationTable } from "../perfil/affiliation-table"; // Importamos el nuevo componente

export default async function InscripcionPage() {
  const userId = await getSession();
  if (!userId) redirect("/login");

  // 1. Obtener datos del usuario, incluyendo sus adhesiones actuales
  const user = await prisma.professional.findUnique({
    where: { id: userId },
    include: { 
      localidad: true,
      obras: true // Esto trae la relación ProfessionalObraSocial
    } 
  });

  if (!user) redirect("/login");

  // 2. Obtener TODAS las obras sociales disponibles para listar en la tabla
  const allObras = await prisma.obraSocial.findMany({
    orderBy: { nombre: 'asc' }
  });

  // 3. Extraer solo los IDs de las obras que el usuario ya tiene seleccionadas
  const selectedObraIds = user.obras.map(relation => relation.obraSocialId);

  // Valores por defecto para el perfil
  const defaultValues = {
    nombre: user.nombre,
    apellido: user.apellido,
    matricula: user.matricula,
    dni: user.dni,
    domicilio: user.domicilio,
    telefono: user.telefono,
    email: user.email,
    localidad: user.localidad?.nombre || "No especificada"
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Sección 1: Datos Personales y Baja */}
      <ProfileForm defaultValues={defaultValues} />
      
      {/* Sección 2: Tabla de Adhesiones */}
      <AffiliationTable 
        allObras={allObras} 
        initialSelectedIds={selectedObraIds} 
      />
    </div>
  );
}
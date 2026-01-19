// app/(dashboard)/inscripcion/page.tsx
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form"; // Importamos el cliente

export default async function InscripcionPage() {
  const userId = await getSession();
  if (!userId) redirect("/login");

  const user = await prisma.professional.findUnique({
    where: { id: userId },
    include: { localidad: true } // Para mostrar el nombre de la localidad
  });

  if (!user) redirect("/login");

  // Preparamos los valores por defecto
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

  return <ProfileForm defaultValues={defaultValues} />;
}
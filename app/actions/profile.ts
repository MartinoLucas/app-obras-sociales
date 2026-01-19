// app/actions/profile.ts
"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcrypt"; // Si permitieras cambiar password, aquí no lo haremos por ahora

export async function updateProfile(data: any) {
  const userId = await getSession();
  if (!userId) return "No autorizado";

  try {
    // Filtramos para que solo actualicen lo permitido
    await prisma.professional.update({
      where: { id: userId },
      data: {
        domicilio: data.domicilio,
        telefono: data.telefono,
        email: data.email,
        // Agrega otros campos si son editables
      },
    });
    revalidatePath("/inscripcion");
  } catch (e) {
    return "Error al actualizar perfil";
  }
}

export async function unsubscribeProfessional() {
  const userId = await getSession();
  if (!userId) return "No autorizado";

  const today = new Date().getDate();
  if (today < 1 || today > 25) {
    return "La baja solo está disponible del 1 al 25 de cada mes.";
  }

  try {
    // Opción 1: Marcar status como inactivo (soft delete)
    await prisma.professional.update({
      where: { id: userId },
      data: { 
        status: 'inactive',
        enrollments: {
          deleteMany: {}
        }
      }
    });
    
    // Opción 2: Eliminar Enrollments futuros... depende de tu lógica de negocio
    
    // Deslogueamos?
    // await clearSession(); 
  } catch (e) {
    return "Error al procesar la baja";
  }
}
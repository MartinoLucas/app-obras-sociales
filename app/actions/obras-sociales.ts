// app/actions/obras-sociales.ts
"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateAffiliations(selectedIds: string[]) {
  const userId = await getSession();
  if (!userId) return "No autorizado";

  // 1. Validar Fechas (1 al 25)
  const day = new Date().getDate();
  if (day < 1 || day > 25) {
    return "Las modificaciones solo están permitidas del 1 al 25 de cada mes.";
  }

  try {
    // Usamos una transacción para asegurar que se borre y se cree todo o nada
    await prisma.$transaction(async (tx) => {
      // A. Borrar todas las adhesiones actuales de este usuario
      await tx.professionalObraSocial.deleteMany({
        where: { professionalId: userId }
      });

      // B. Crear las nuevas adhesiones si hay alguna seleccionada
      if (selectedIds.length > 0) {
        await tx.professionalObraSocial.createMany({
          data: selectedIds.map((osId) => ({
            professionalId: userId,
            obraSocialId: osId
          }))
        });
      }
    });

    revalidatePath("/inscripcion");
    return null; // Null indica éxito
  } catch (error) {
    console.error(error);
    return "Error al actualizar las adhesiones.";
  }
}
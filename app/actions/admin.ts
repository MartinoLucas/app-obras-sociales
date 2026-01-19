"use server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function createObraSocial(nombre: string) {
  const uid = await getSession();
  // Validar admin aqui...
  
  try {
    await prisma.obraSocial.create({ data: { nombre } });
    return { success: true };
  } catch (e) {
    return { error: "Ya existe o error interno" };
  }
}
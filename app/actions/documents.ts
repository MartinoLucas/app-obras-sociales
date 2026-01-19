// app/actions/documents.ts
"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { DocumentService } from "@/services/documentService";
import { PrismaDocumentRepo } from "@/infra/repositories/prismaDocumentRepo";
import { PrismaEnrollmentRepo } from "@/infra/repositories/prismaEnrollmentRepo";
import { LocalStorageAdapter } from "@/infra/storage/localStorageAdapter";

export async function uploadDocumentAction(formData: FormData) {
  const userId = await getSession();
  if (!userId) return "No autenticado";

  const kind = formData.get("kind") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) return "Archivo inválido";
  if (!["prestadores", "mala_praxis", "monotributo", "habilitacion"].includes(kind)) return "Tipo inválido";

  // Usamos tus servicios existentes
  const service = new DocumentService(
    new PrismaDocumentRepo(),
    new PrismaEnrollmentRepo(),
    new LocalStorageAdapter()
  );

  try {
    await service.upload(userId, kind as any, file);
    return null; // Null significa éxito en tu patrón actual
  } catch (e: any) {
    return e.message || "Error al subir";
  }
}

export async function getUserDocuments() {
  const userId = await getSession();
  if (!userId) return [];

  const docs = await prisma.document.findMany({
    where: { professionalId: userId },
    orderBy: { uploadedAt: 'desc' },
    select: {
      id: true,
      kind: true,
      url: true,
      uploadedAt: true
    }
  });

  return docs;
}
// app/(dashboard)/documentos/page.tsx

import { z } from "zod"; // Zod validation
import { getUserDocuments, uploadDocumentAction } from "@/app/actions/documents";      // (Nueva Server Action)
import { getSession } from "@/lib/auth";
import { redirect } from "next/dist/client/components/navigation";
import DocumentsView from "./documents-view";

export default async function DocumentosPage() {

  // 1. Verificar sesión
  const userId = await getSession();
  if (!userId) redirect("/login");

  // 2. Obtener los documentos desde la DB (Server-side)
  const documents = await getUserDocuments();

  return <DocumentsView initialData={documents} />;
}
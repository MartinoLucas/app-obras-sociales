"use client";

import { z } from "zod";
import { useRouter } from "next/navigation";
import { FormTemplate } from "@/components/forms/FormTemplate";
import { FieldGroup } from "@/components/ui/field";
import { SelectField } from "@/components/forms/fields/SelectField";
import { FileField } from "@/components/forms/fields/FileField";
import { uploadDocumentAction } from "@/app/actions/documents";
import { DataTable, type ColumnDef } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText } from "lucide-react";

// --- DICCIONARIO PARA NOMBRES LINDOS ---
const KIND_LABELS: Record<string, string> = {
  prestadores: "Registro Nacional de Prestadores",
  mala_praxis: "Seguro Mala Praxis",
  monotributo: "Constancia de Monotributo",
  habilitacion: "Habilitación de Consultorio",
};

// --- ESQUEMA DEL FORMULARIO ---
const docSchema = z.object({
  kind: z.enum(["prestadores", "mala_praxis", "monotributo", "habilitacion"], {
    message: "Seleccioná un tipo de documento",
  }),
  file: z.any().refine((file) => file instanceof File, "Debes subir un archivo"),
});

// --- DEFINICIÓN DE LA TABLA ---
type DocumentRow = {
  id: string;
  kind: string;
  url: string;
  uploadedAt: Date;
};

export default function DocumentsView({ initialData }: { initialData: DocumentRow[] }) {
  const router = useRouter();

  // Definición de Columnas
  const columns: ColumnDef<DocumentRow>[] = [
    {
      id: "kind",
      header: "Documento",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{KIND_LABELS[r.kind] || r.kind}</span>
        </div>
      ),
    },
    {
      id: "date",
      header: "Fecha de Subida",
      cell: (r) => <span className="text-gray-500">
        {new Date(r.uploadedAt).toLocaleDateString('es-AR', {
             day: '2-digit', 
             month: '2-digit', 
             year: 'numeric' 
          })}
      </span>,
    },
    {
      id: "actions",
      header: "Acciones",
      align: "right",
      cell: (r) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" asChild>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver
            </a>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {/* 1. EL FORMULARIO */}
      <FormTemplate
        schema={docSchema}
        title="Legajo Digital"
        description="Sube la documentación requerida. Plazo máximo: 3 meses desde la inscripción."
        defaultValues={{ kind: "prestadores", file: undefined }}
        submitText="Subir Documento"
        successToast="Archivo subido correctamente."
        onSubmit={async (values) => {
          const fd = new FormData();
          fd.append("kind", values.kind);
          fd.append("file", values.file);

          const error = await uploadDocumentAction(fd);
          
          if (!error) {
            // ✅ ESTO ES CLAVE: Recarga los datos del servidor para actualizar la tabla
            router.refresh(); 
          }
          return error;
        }}
      >
        {({ form }) => (
          <FieldGroup>
            <SelectField
              control={form.control}
              name="kind"
              label="Tipo de Documento"
              options={[
                { value: "prestadores", label: "Registro Nacional de Prestadores" },
                { value: "mala_praxis", label: "Seguro Mala Praxis (Hoja 1)" },
                { value: "monotributo", label: "Constancia de Monotributo" },
                { value: "habilitacion", label: "Habilitación de Consultorio" },
              ]}
            />
            <FileField
              control={form.control}
              name="file"
              label="Archivo"
              description="Formatos aceptados: PDF, JPG. Máx 5MB."
            />
          </FieldGroup>
        )}
      </FormTemplate>

      {/* 2. LA TABLA DE ARCHIVOS */}
      <div className="container mx-auto px-4 max-w-3xl md:max-w-4xl lg:max-w-7xl">
        <DataTable
            title="Mis Documentos Subidos"
            description="Historial de documentación presentada."
            data={initialData}
            columns={columns}
            getRowKey={(r) => r.id}
            emptyState="No has subido ningún documento todavía."
        />
      </div>
    </div>
  );
}
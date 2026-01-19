// app/(dashboard)/documentos/page.tsx
"use client";

import * as React from "react";
import { z } from "zod"; // Zod validation
import { FormTemplate } from "@/components/forms/FormTemplate";
import { FieldGroup } from "@/components/ui/field";
import { SelectField } from "@/components/forms/fields/SelectField"; // (El que creamos arriba)
import { FileField } from "@/components/forms/fields/FileField";     // (El que creamos arriba)
import { uploadDocumentAction } from "@/app/actions/documents";      // (Nueva Server Action)

// 1. Esquema
const docSchema = z.object({
  kind: z.enum(["prestadores", "mala_praxis", "monotributo", "habilitacion"], {
    message: "Seleccioná un tipo de documento",
  }),
  // Validación de archivo en cliente es limitada con Zod directo, validamos existencia
  file: z.any().refine((file) => file instanceof File, "Debes subir un archivo"),
});

export default function DocumentosPage() {
  return (
    <FormTemplate
      schema={docSchema}
      title="Legajo Digital"
      description="Sube la documentación requerida. Plazo máximo: 3 meses desde la inscripción."
      defaultValues={{ kind: "prestadores", file: undefined }}
      submitText="Subir Documento"
      successToast="Archivo subido correctamente."
      
      // La lógica de envío
      onSubmit={async (values) => {
        const fd = new FormData();
        fd.append("kind", values.kind);
        fd.append("file", values.file);
        
        // Llamamos a una Server Action en lugar de fetch api puro para mantener consistencia
        const error = await uploadDocumentAction(fd);
        if (error) return error;
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
  );
}
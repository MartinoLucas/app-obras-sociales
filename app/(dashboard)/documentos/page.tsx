// app/(dashboard)/documentos/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";

export default function DocumentosPage() {
  const [loading, setLoading] = useState(false);

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    
    try {
      const res = await fetch('/api/documents/upload', { method: 'POST', body: fd });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error);
      toast.success("Documento subido correctamente");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error(err.message || "Error al subir documento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="bg-white rounded-lg shadow border p-8">
        <h1 className="text-2xl font-bold mb-2">Documentación Requerida</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Tienes un plazo de 3 meses para completar tu legajo digital.
        </p>

        <form onSubmit={upload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Tipo de Documento
            </label>
            <select name="kind" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="prestadores">Registro Nacional de Prestadores</option>
              <option value="mala_praxis">Seguro Mala Praxis (hoja 1)</option>
              <option value="monotributo">Constancia de Monotributo</option>
              <option value="habilitacion">Habilitación de Consultorio</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Archivo (PDF o JPG)
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastra el archivo</p>
                </div>
                <input id="dropzone-file" name="file" type="file" className="hidden" required />
              </label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Subiendo..." : "Subir Documento"}
          </Button>
        </form>
      </div>
      
      {/* Lista de documentos subidos (Opcional, requiere fetch server-side) */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
         <h4 className="font-semibold text-blue-900 text-sm">Recordatorio</h4>
         <p className="text-sm text-blue-700 mt-1">Asegúrate de que los archivos sean legibles y estén vigentes.</p>
      </div>
    </div>
  );
}
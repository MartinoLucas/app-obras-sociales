// app/(dashboard)/admin/export/export-controls.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Lock } from "lucide-react";
import { toast } from "sonner";

export function ExportControls() {
  const [day, setDay] = useState(0);

  useEffect(() => {
    setDay(new Date().getDate());
  }, []);

  // Habilitado del 26 al 31 (fin de mes)
  const canExport = day >= 26;

  const handleExport = (type: string) => {
    if (!canExport) {
        toast.error("Las exportaciones solo están habilitadas del 26 a fin de mes.");
        return;
    }
    // Aquí llamarías a tu API route: window.open(`/api/export/${type}`, '_blank');
    toast.info(`Iniciando descarga: ${type}...`);
    window.location.href = `/api/export/${type}`;
  };

  return (
    <div className="grid gap-6">
      {!canExport && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-center gap-3 text-yellow-800">
          <Lock className="w-5 h-5" />
          <span>
            El módulo de exportación está cerrado. Se habilitará el día 26 (Hoy es {day}).
          </span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Por Obra Social" description="Listado agrupado por OS" onClick={() => handleExport('obras-sociales')} disabled={!canExport} />
        <Card title="Por Localidad" description="Distribución geográfica" onClick={() => handleExport('localidad')} disabled={!canExport} />
        <Card title="Por Práctica" description="Especialidades y prácticas" onClick={() => handleExport('practica')} disabled={!canExport} />
      </div>
    </div>
  );
}

function Card({ title, description, onClick, disabled }: any) {
  return (
    <div className={`border rounded-xl p-6 flex flex-col justify-between ${disabled ? 'opacity-50 bg-gray-50' : 'bg-white hover:shadow-md transition-shadow'}`}>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <Button onClick={onClick} disabled={disabled} className="mt-4 w-full" variant="outline">
        <FileDown className="w-4 h-4 mr-2" />
        Exportar CSV
      </Button>
    </div>
  );
}
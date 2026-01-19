// app/(dashboard)/aceptacion-profesionales/pending-table.tsx
"use client"; // ✅ ESTO SÍ VA AQUÍ

import * as React from "react";
import { DataTable, type ColumnDef } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { activateProfessional } from "@/app/actions/professionals";
import { useRouter } from "next/navigation";

// Definimos el tipo de dato que vamos a mostrar (en este caso, Profesionales, no Invoices)
export type ProfessionalRow = {
  id: string;
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  status: string;
};

interface PendingTableProps {
  data: ProfessionalRow[];
}

export function PendingTable({ data }: PendingTableProps) {

    const router = useRouter();
  
  // Definimos las columnas para los Profesionales
  const columns: ColumnDef<ProfessionalRow>[] = [
    { 
      id: "nombre", 
      header: "Nombre", 
      cell: (r) => <span className="font-medium">{r.nombre} {r.apellido}</span> 
    },
    { 
      id: "matricula", 
      header: "Matrícula", 
      cell: (r) => r.matricula 
    },
    { 
      id: "email", 
      header: "Email", 
      cell: (r) => r.email,
      hideOnMobile: true 
    },
    { 
      id: "actions", 
      header: "Acciones", 
      align: "right", 
      cell: (r) => (
        <div className="flex justify-end gap-2">
           <Button size="sm" onClick={async () => {
                try {
                  const error = await activateProfessional(r.id);
                  
                  if (error) {
                    toast.error(error); // Mostrar error si tu Server Action devuelve uno
                  } else {
                    toast.success(`¡${r.nombre} aceptado!`);
                    router.refresh(); // 3. REFRESCAR LOS DATOS
                  }
                } catch (e) {
                  toast.error("Ocurrió un error inesperado");
                }
             }}>
             {r.status === 'inactive' ? 'Reactivar' : 'Aceptar'}
           </Button>
           {/* <Button size="sm" variant="destructive" onClick={() => toast.error("Rechazando...")}>
             Rechazar
           </Button> */}
        </div>
      ) 
    },
  ];

  return (
    <DataTable
      title="Profesionales Pendientes"
      description="Listado de profesionales esperando aprobación."
      data={data}
      columns={columns}
      getRowKey={(r) => r.id}
      enableSearch
      searchPlaceholder="Buscar por nombre o matrícula..."
      searchAccessor={(row) => `${row.nombre} ${row.apellido} ${row.matricula}`}
    />
  );
}
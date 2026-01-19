"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateAffiliations } from "@/app/actions/obras-sociales";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Si no tenés este comp, usá input type="checkbox"

type ObraSocial = {
  id: string;
  nombre: string;
};

interface Props {
  allObras: ObraSocial[];
  initialSelectedIds: string[];
}

export function AffiliationTable({ allObras, initialSelectedIds }: Props) {
  // Estado local para manejar las selecciones
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelectedIds));
  const [isPending, setIsPending] = useState(false);

  // Verificar fecha para deshabilitar si no es del 1 al 25
  const day = new Date().getDate();
  const isEditable = day >= 1 && day <= 25;

  // Manejar el cambio de un checkbox
  const toggleSelection = (id: string) => {
    if (!isEditable) return;
    
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Guardar cambios
  const handleSave = async () => {
    setIsPending(true);
    const error = await updateAffiliations(Array.from(selectedIds));
    setIsPending(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Adhesiones actualizadas correctamente.");
    }
  };

  return (
    <Card className="w-full shadow-lg bg-white mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Obras Sociales Adheridas</CardTitle>
        <CardDescription>
          Seleccioná las obras sociales con las que trabajarás. {selectedIds.size} seleccionadas.
        </CardDescription>
        {!isEditable && (
          <div className="bg-yellow-50 text-yellow-800 p-2 text-sm rounded border border-yellow-200 mt-2">
            ⚠️ El periodo de modificación está cerrado (Solo del 1 al 25).
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-100 overflow-y-auto border-t border-b">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-semibold sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 w-16 text-center">
                  {/* Checkbox global (opcional, para seleccionar todas) */}
                  #
                </th>
                <th className="px-6 py-3">Nombre de la Obra Social</th>
                <th className="px-6 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allObras.map((os) => {
                const isSelected = selectedIds.has(os.id);
                return (
                  <tr 
                    key={os.id} 
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${isSelected ? 'bg-blue-50/50' : ''}`}
                    onClick={() => toggleSelection(os.id)}
                  >
                    <td className="px-6 py-3 text-center">
                      <Checkbox
                        checked={isSelected}
                        // Radix usa onCheckedChange. Lo conectamos a tu función.
                        onCheckedChange={() => toggleSelection(os.id)} 
                        disabled={!isEditable}
                        // Quitamos clases de input nativo, el componente ya trae sus estilos
                        className="border-gray-300" 
                      />
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-700">
                      {os.nombre}
                    </td>
                    <td className="px-6 py-3 text-right">
                        {isSelected ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Adherido
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs">No adherido</span>
                        )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end py-4 bg-gray-50/50">
        <Button 
          onClick={handleSave} 
          disabled={!isEditable || isPending}
          className="w-full md:w-auto"
        >
          {isPending ? "Guardando..." : "Actualizar Adhesiones"}
        </Button>
      </CardFooter>
    </Card>
  );
}
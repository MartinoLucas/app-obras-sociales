// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex flex-col min-h-[calc(90vh-64px)] bg-gray-50">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-white">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Sistema de Gestión <br />
          <span className="text-blue-600">Obras Sociales</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
          Gestiona tu inscripción mensual, sube tu documentación obligatoria y mantén tu estado profesional al día.
        </p>
        
        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" variant="outline">Ya tengo cuenta</Button>
          </Link>
          <Link href="/register">
            <Button size="lg">Solicitar Matriculación</Button>
          </Link>
        </div>
      </section>

      {/* Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 container mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-2">Inscripción Mensual</h3>
          <p className="text-gray-600">Habilitada exclusivamente del <span className="font-bold text-blue-600">1 al 25</span> de cada mes.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-2">Documentación</h3>
          <p className="text-gray-600">Plazo de 3 meses para regularizar Seguro, Monotributo y Habilitaciones.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-2">Soporte</h3>
          <p className="text-gray-600">Contacta al distrito para consultas sobre exportación y padrones.</p>
        </div>
      </section>
    </main>
  );
}
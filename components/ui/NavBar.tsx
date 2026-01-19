"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export default function NavBar() {
    const pathname = usePathname();

    // 1. LÓGICA DE VISIBILIDAD
    // Solo mostramos la nav si estamos en la ruta principal o subrutas de aceptacion-profesionales
    const showNavBar = pathname.startsWith("/aceptacion-profesionales");

    // Si no cumple la condición, no renderizamos nada (ni siquiera el tag header)
    if (!showNavBar) return null;

    const navLinks = [
        { href: "/", label: "Inicio" },
        { href: "/login", label: "Iniciar Sesión" },
        { href: "/register", label: "Registrarse" },
        { href: "/aceptacion-profesionales", label: "Aceptar Profesionales" },
    ];

    return (
        // 2. AGREGAMOS LA CLASE 'animate-slide-down'
        // Al estar en el Layout, esta animación solo corre cuando el componente se MONTA.
        // Si navegas dentro de subrutas de aceptación, el componente persiste y no re-anima.
        <header className="flex flex-col w-full animate-slide-down">
            {/* --- SECCIÓN SUPERIOR: LOGO Y TÍTULO (Fondo Blanco) --- */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 relative z-20 shadow-md">
                <div className="h-12 w-auto relative">
                    <Image 
                        src="/logo.png" 
                        alt="Logo del Colegio de Psicólogos" 
                        width={988} 
                        height={179} 
                        className="h-full w-auto object-contain"
                        priority 
                    />
                </div>

                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-800 hidden md:block">
                        Registro de Obras Sociales | Colegio de Psicólogos
                    </h1>
                    <h1 className="text-lg font-bold text-gray-800 md:hidden">
                        Registro de Obras Sociales
                    </h1>
                </div>
            </div>

            {/* --- SECCIÓN INFERIOR: LINKS --- */}
            <nav className="bg-slate-100 w-full shadow-md px-6 py-3 overflow-x-auto flex items-center">
                <div className="flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={cn(
                                    "text-sm font-medium transition-colors whitespace-nowrap",
                                    isActive 
                                        ? "text-blue-700 font-bold"
                                        : "text-gray-600 hover:text-blue-600"
                                )}
                            >
                                {link.label}
                                {isActive && (
                                    <span className="block h-0.5 w-full bg-blue-700 mt-0.5 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
                <Button onClick={() => console.log("hola")} variant="outline" size="sm" className="ml-auto whitespace-nowrap flex items-center gap-2 justify-center">
                    Salir
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                </Button>
            </nav>
        </header>
    );
}
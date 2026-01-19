"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { logoutProfessional } from "@/app/actions/auth";

// Simulamos obtener el rol desde una cookie o un contexto (idealmente usarías un SessionProvider)
// Por ahora, asumimos que si estás en rutas protegidas, estás logueado.

export default function NavBar() {
    const pathname = usePathname();
    
    // Rutas donde NO queremos navbar (login, register, landing si quisieras un header distinto)
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isLanding = pathname === "/";
    
    if (isAuthPage) return null;

    // Links base
    let navLinks = [
        { href: "/", label: "Inicio" },
    ];

    // Detectar si estamos en zona admin o user (esto es una mejora visual, la seguridad real está en el layout/middleware)
    const isAdminRoute = pathname.startsWith("/aceptacion-profesionales") || pathname.startsWith("/admin");
    const isUserRoute = pathname.startsWith("/inscripcion") || pathname.startsWith("/documentos") || pathname.startsWith("/dashboard");

    if (isAdminRoute) {
        navLinks = [
            { href: "/admin/aceptacion-profesionales", label: "Aceptación" },
            { href: "/admin/profesionales", label: "Profesionales" },
            { href: "/admin/obras-sociales", label: "Obras Sociales" }, // AGREGADO
            { href: "/admin/export", label: "Exportar" },
        ];
    } else if (isUserRoute) {
        navLinks = [
            { href: "/inscripcion", label: "Inscripción Mensual" },
            { href: "/documentos", label: "Legajo Digital" },
        ];
    } else {
        // Landing
        navLinks.push({ href: "/login", label: "Ingresar" });
        navLinks.push({ href: "/register", label: "Matricularme" });
    }

    return (
        <header className="flex flex-col w-full animate-slide-down sticky top-0 z-50">
            {/* LOGO AREA */}
            <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm relative z-20">
                <div className="h-10 w-auto relative">
                     {/* Placeholder si no carga la imagen */}
                    <div className="flex items-center font-bold text-xl tracking-tight">
                        <span className="text-blue-600 mr-2">Ψ</span> Colegio
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg font-bold text-gray-800 leading-tight">
                        Sistema de Gestión
                    </h1>
                    <span className="text-xs text-gray-500">Obras Sociales</span>
                </div>
            </div>

            {/* NAV LINKS AREA (Solo si no es landing o si queremos mostrar links en landing) */}
            {!isLanding && (
                <nav className="bg-slate-50/80 backdrop-blur-md w-full border-b border-gray-200 px-6 py-2 overflow-x-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={cn(
                                        "text-sm font-medium transition-colors relative py-1",
                                        isActive ? "text-blue-700" : "text-gray-600 hover:text-blue-600"
                                    )}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    
                    <Button 
                        onClick={() => logoutProfessional()} 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto whitespace-nowrap flex items-center gap-2 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                    >
                        Salir
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                    </Button>
                </nav>
            )}
        </header>
    );
}
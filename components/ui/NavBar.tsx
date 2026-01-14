export default function NavBar() {
    return (
        <nav className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">O</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800">Colegio de Psicólogos | Registro de Obraas Sociales | Junín</h1>
            </div>
        </nav>
    );
}
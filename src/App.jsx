import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import UniversidadesPage from "./pages/UniversidadesPage";
import ProfesoresPage from "./pages/ProfesoresPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import BuscarMaterialPage from "./pages/BuscarMaterialPage";
import MisMaterialesSubidosPage from "./pages/MisMaterialesSubidosPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [adminMode, setAdminMode] = useState(false); // false = usuario, true = admin

  const renderPage = () => {
    switch (currentPage) {
      case "universidades":
        return <UniversidadesPage adminMode={adminMode} />;
      case "profesores":
        return <ProfesoresPage adminMode={adminMode} />;
      case "asignaturas":
        return <AsignaturasPage adminMode={adminMode} />;
      case "buscar":
        return <BuscarMaterialPage adminMode={adminMode} />;
      case "mis-materiales":
        return <MisMaterialesSubidosPage adminMode={adminMode} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} adminMode={adminMode} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-red-700 text-white p-4 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">UniclouD</h1>
            {adminMode && (
              <span className="text-xs bg-yellow-500 text-red-700 px-2 py-1 rounded font-semibold">
                Modo Administrador activo
              </span>
            )}
          </div>

          <button
            onClick={() => setAdminMode(!adminMode)}
            className={`px-4 py-2 rounded font-semibold transition ${
              adminMode
                ? "bg-yellow-500 text-red-700 hover:bg-yellow-400"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            Modo Admin: {adminMode ? "ON" : "OFF"}
          </button>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 mt-16">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} userRole={adminMode ? "admin" : "user"} />

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-6xl">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Footer fijo */}
      <footer className="bg-red-700 text-white p-6 text-center text-sm mt-auto">
        UniclouD – Sistema de Gestión de Material Académico
      </footer>
    </div>
  );
}


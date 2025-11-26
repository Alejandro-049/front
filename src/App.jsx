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
  const [userRole, setUserRole] = useState("admin"); // 'admin' | 'user'

  const renderPage = () => {
    switch (currentPage) {
      case "universidades":
        return <UniversidadesPage userRole={userRole} />;
      case "profesores":
        return <ProfesoresPage userRole={userRole} />;
      case "asignaturas":
        return <AsignaturasPage userRole={userRole} />;
      case "buscar":
        return <BuscarMaterialPage userRole={userRole} />;
      case "mis-materiales":
        return <MisMaterialesSubidosPage userRole={userRole} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header fijo */}
      <header className="fixed top-0 left-0 right-0 bg-red-700 text-white p-4 z-20">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">UniclouD</h1>
            <span className="text-sm opacity-90">
              {userRole === "admin" ? "🔐 Administrador" : "👤 Usuario"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-white">Rol:</div>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="rounded px-2 py-1 text-red-700 font-medium"
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>
        </div>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex flex-1 mt-16">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} userRole={userRole} />

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


import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import UniversidadesPage from "./pages/UniversidadesPage";
import ProfesoresPage from "./pages/ProfesoresPage";
import AsignaturasPage from "./pages/AsignaturasPage";
import SubirMaterialPage from "./pages/SubirMaterialPage";
import BuscarMaterialPage from "./pages/BuscarMaterialPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "universidades":
        return <UniversidadesPage />;
      case "profesores":
        return <ProfesoresPage />;
      case "asignaturas":
        return <AsignaturasPage />;
      case "subir":
        return <SubirMaterialPage />;
      case "buscar":
        return <BuscarMaterialPage />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">UniclouD</h1>
          {currentPage !== "dashboard" && (
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Volver
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-6 max-w-6xl">
        {renderPage()}
      </main>

      <footer className="bg-gray-800 text-white p-6 mt-10">
        <div className="container mx-auto text-center text-sm">
          UniclouD – Sistema de Gestión de Material Académico
        </div>
      </footer>
    </div>
  );
}


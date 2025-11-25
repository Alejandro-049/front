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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-red-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">UniclouD</h1>
          {currentPage !== "dashboard" && (
            <button
              onClick={() => setCurrentPage("dashboard")}
              className="bg-yellow-500 text-red-700 px-4 py-2 rounded hover:bg-yellow-400 font-semibold"
            >
              Volver
            </button>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-6 max-w-6xl flex-grow">
        {renderPage()}
      </main>

      <footer className="bg-red-700 text-white p-6 mt-auto">
        <div className="container mx-auto text-center text-sm">
          UniclouD – Sistema de Gestión de Material Académico
        </div>
      </footer>
    </div>
  );
}


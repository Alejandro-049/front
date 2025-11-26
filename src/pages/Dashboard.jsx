import DashboardCard from "../components/DashboardCard";
import { useState, useEffect } from "react";

export default function Dashboard({ onNavigate, adminMode }) {
  const isAdmin = adminMode;

  // cargar 'mis materiales' desde localStorage
  const [misMateriales, setMisMateriales] = useState([]);

  useEffect(() => {
    try {
      const key = 'downloadedMaterials';
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      setMisMateriales(stored);
    } catch (err) {
      setMisMateriales([]);
    }
  }, []);

  const adminCards = [
    { title: "Buscar Material", description: "Consultar y descargar recursos", page: "buscar" },
    { title: "Universidades", description: "Crear y gestionar universidades", page: "universidades" },
    { title: "Profesores", description: "Registrar profesores asociados", page: "profesores" },
    { title: "Asignaturas", description: "Gestionar asignaturas universitarias", page: "asignaturas" },
    { title: "Subir Material", description: "Cargar material académico", page: "subir" },
  ];

  const userCards = [
    { title: "Buscar Material", description: "Consultar recursos existentes", page: "buscar" },
    { title: "Asignaturas", description: "Consultar asignaturas (solo lectura)", page: "asignaturas" },
    { title: "Profesores", description: "Consultar profesores (solo lectura)", page: "profesores" },
  ];

  const cards = isAdmin ? adminCards : userCards;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-1 text-red-700">{isAdmin ? "Panel de Administración" : "Inicio"}</h1>
          <p className="text-gray-700">{isAdmin ? "Accede a las funciones administrativas" : "Resumen de tu actividad"}</p>
        </div>

        <div />
      </div>

      {/* Mis Materiales (inicio) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Mis Materiales</h2>
        {misMateriales.length === 0 ? (
          <div className="p-6 bg-white rounded-lg border text-gray-600">No tienes materiales descargados aún.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {misMateriales.map((m) => (
              <div key={m.idMaterial} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                <div>
                  <div className="font-semibold text-red-700">{m.titulo}</div>
                  <div className="text-sm text-gray-600">Año: {m.año}</div>
                </div>
                <div>
                  <a className="inline-block bg-yellow-500 text-red-700 px-3 py-1 rounded font-semibold" href={m.ruta} target="_blank" rel="noreferrer">Abrir</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Las opciones del sistema están disponibles en la barra lateral. */}
    </div>
  );
}

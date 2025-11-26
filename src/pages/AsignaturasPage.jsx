import { useState, useEffect } from "react";
import { asignaturaService } from "../services/asignaturaService";
import Alert from "../components/Alert";

export default function AsignaturasPage({ adminMode }) {
  const [asignaturas, setAsignaturas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAsignaturas();
  }, []);

  const loadAsignaturas = async () => {
    try {
      const data = await asignaturaService.getAll();
      setAsignaturas(data);
    } catch (error) {
      setMessage({ type: "error", text: "Error al cargar asignaturas" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await asignaturaService.create({ idAsignatura: nombre });
      setMessage({ type: "success", text: "Asignatura creada" });
      setNombre("");
      loadAsignaturas();
    } catch (error) {
      setMessage({ type: "error", text: "Error al crear asignatura" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta asignatura?")) return;

    try {
      await asignaturaService.delete(id);
      setMessage({ type: "success", text: "Asignatura eliminada" });
      loadAsignaturas();
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar asignatura" });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Asignaturas</h2>

      {message && <Alert type={message.type}>{message.text}</Alert>}

      {adminMode ? (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Nueva Asignatura</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la Asignatura
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold"
            >
              Crear Asignatura
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded p-4 mb-6">
          Modo lectura: No tienes permisos para crear asignaturas.
        </div>
      )}

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Asignaturas Registradas</h3>
        <div className="space-y-2">
          {asignaturas.map((asig) => (
            <div
              key={asig.idAsignatura}
              className="flex justify-between items-center p-3 border rounded"
            >
              <div className="font-medium">{asig.materia}</div>
              {adminMode ? (
                <button
                  onClick={() => handleDelete(asig.idAsignatura)}
                  className="text-red-600 hover:underline text-sm font-semibold"
                >
                  Eliminar
                </button>
              ) : (
                <div className="text-sm text-gray-500">Visualización</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
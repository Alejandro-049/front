import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { universidadService } from "../services/universidadService";
import { asignaturaService } from "../services/asignaturaService";
import { profesorService } from "../services/profesorService";

export default function UploadMaterialModal({ onClose, onSubmit, userRole }) {
  const [form, setForm] = useState({
    titulo: "",
    asignatura: "",
    profesor: "",
    universidad: "",
    categoria: "",
    detalles: "",
    archivo: null,
  });
  const [universidades, setUniversidades] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [univs, asigs, profs] = await Promise.all([
        universidadService.getAll(),
        asignaturaService.getAll(),
        profesorService.getAll(),
      ]);
      setUniversidades(univs);
      setAsignaturas(asigs);
      setProfesores(profs);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo || !form.asignatura) {
      alert("Por favor completa al menos título y asignatura");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSubmit({
        titulo: form.titulo,
        asignatura: form.asignatura,
        profesor: form.profesor,
        universidad: form.universidad,
        categoria: form.categoria,
        detalles: form.detalles,
        archivo: form.archivo?.name || "documento.pdf",
        fecha: new Date().toLocaleDateString(),
      });
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-700">Subir Nuevo Material</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Apuntes Matemáticas"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Asignatura *</label>
                <select
                  value={form.asignatura}
                  onChange={(e) => setForm({ ...form, asignatura: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Selecciona una asignatura</option>
                  {asignaturas.map((a) => (
                    <option key={a.idAsignatura} value={a.idAsignatura}>
                      {a.idAsignatura}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profesor</label>
                <select
                  value={form.profesor}
                  onChange={(e) => setForm({ ...form, profesor: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Selecciona un profesor</option>
                  {profesores.map((p) => (
                    <option key={p.idProfesor} value={p.idProfesor}>
                      {p.nombre} {p.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Universidad</label>
                <select
                  value={form.universidad}
                  onChange={(e) => setForm({ ...form, universidad: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Selecciona una universidad</option>
                  {universidades.map((u) => (
                    <option key={u.idUniversidad} value={u.idUniversidad}>
                      {u.universidad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="apuntes">Apuntes</option>
                  <option value="ejercicios">Ejercicios</option>
                  <option value="examen">Examen</option>
                  <option value="resumen">Resumen</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Archivo</label>
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, archivo: e.target.files?.[0] })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Detalles Adicionales</label>
              <textarea
                value={form.detalles}
                onChange={(e) => setForm({ ...form, detalles: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Añade información adicional sobre el material..."
                rows="3"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold disabled:opacity-50"
              >
                {loading ? "Subiendo..." : "Subir Material"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

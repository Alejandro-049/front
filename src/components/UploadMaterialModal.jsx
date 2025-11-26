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
    anio: "",
    archivo: null,
  });
  const [universidades, setUniversidades] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

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
        archivo: form.archivo?.name || "documento.pdf",
        anio: form.anio,
        fecha: form.anio || new Date().toLocaleDateString(),
      });
      setLoading(false);
    }, 500);
  };

  const handleNext = () => {
    // Validate required fields of step 1 (asignatura required)
    if (!form.asignatura) {
      alert("Por favor selecciona una asignatura antes de continuar");
      return;
    }
    setStep(2);
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

          {/* Indicador de pasos */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 1 ? 'bg-yellow-500 text-red-700 font-semibold' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="w-10 h-1 bg-gray-200" />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-yellow-500 text-red-700 font-semibold' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
            </div>
            <div className="text-sm text-gray-600">Paso {step} de 2</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Módulo 1: Universidad / Profesor / Asignatura */}
            {step === 1 && (
              <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-3 text-red-700">Metadatos - Parte 1</h4>
              <div className="grid grid-cols-1 gap-4">
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
                        {a.nombre || a.idAsignatura}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              </div>
            )}

            {/* Módulo 2: Título / Año / Archivo */}
            {step === 2 && (
              <div className="bg-gray-50 p-4 rounded border">
              <h4 className="font-semibold mb-3 text-red-700">Metadatos - Parte 2</h4>
              <div className="grid grid-cols-1 gap-4">
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
                  <label className="block text-sm font-medium mb-1">Año</label>
                  <input
                    type="number"
                    value={form.anio}
                    onChange={(e) => setForm({ ...form, anio: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="2025"
                    min="1900"
                    max="2100"
                  />
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

              {/* Detalles eliminados por petición */}
              </div>
            )}

            {/* Botones condicionales por paso */}
            {step === 1 ? (
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-yellow-500 text-red-700 px-4 py-2 rounded hover:bg-yellow-400 font-semibold"
                >
                  Siguiente
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold disabled:opacity-50"
                >
                  {loading ? "Subiendo..." : "Subir Material"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

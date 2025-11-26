import { useState, useEffect } from "react";
import { X } from "lucide-react";
import MultiSelect from "./MultiSelect";
import Alert from "./Alert";
import { universidadService } from "../services/universidadService";
import { asignaturaService } from "../services/asignaturaService";
import { profesorService } from "../services/profesorService";
import { articulosGeneralesService } from "../services/articulosGeneralesService";
import { materialService } from "../services/materialService";

export default function UploadMaterialModal({ onClose, onSubmit, adminMode }) {
  const [form, setForm] = useState({
    titulo: "",
    asignatura: [],
    profesor: [],
    universidad: [],
    anio: "",
    archivo: null,
  });
  const [universidades, setUniversidades] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [existingMateriales, setExistingMateriales] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [existingError, setExistingError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Validaciones
    if (!form.titulo.trim()) {
      setSubmitError("Por favor completa el título");
      return;
    }

    if (!form.archivo) {
      setSubmitError("Por favor selecciona un archivo");
      return;
    }

    if (form.asignatura.length === 0) {
      setSubmitError("Por favor selecciona al menos una asignatura");
      return;
    }

    if (form.universidad.length === 0) {
      setSubmitError("Por favor selecciona al menos una universidad");
      return;
    }

    if (form.profesor.length === 0) {
      setSubmitError("Por favor selecciona al menos un profesor");
      return;
    }

    setLoading(true);

    try {
      // Crear FormData para multipart/form-data
      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("año", form.anio || new Date().getFullYear());
      formData.append("archivo", form.archivo);

      // Agregar múltiples IDs
      form.universidad.forEach((id) => formData.append("universidadIds", id));
      form.asignatura.forEach((id) => formData.append("asignaturaIds", id));
      form.profesor.forEach((id) => formData.append("profesorIds", id));

      // Llamar al endpoint con artículos
      const response = await materialService.uploadConArticulos(formData);

    if (response.success) {
      // Preparar datos para mostrar
      const universidadesNombres = form.universidad
        .map((id) => universidades.find((u) => u.idUniversidad === id)?.universidad)
        .filter(Boolean);

      const asignaturasNombres = form.asignatura
        .map((id) => asignaturas.find((a) => a.idAsignatura === id)?.materia)
        .filter(Boolean);

      const profesoresNombres = form.profesor
        .map((id) => {
          const prof = profesores.find((p) => p.idProfesor === id);
          return prof ? `${prof.nombre} ${prof.apellido}` : null;
        })
        .filter(Boolean);

      // ← AGREGAR ESTO: Capturar el idMaterial de la respuesta
      console.log("Respuesta del servidor:", response);
      const idMaterial = response.data?.idMaterial || response.idMaterial;

      // Llamar al onSubmit con los datos
      onSubmit({
        titulo: form.titulo,
        asignatura: asignaturasNombres,
        profesor: profesoresNombres,
        universidad: universidadesNombres,
        archivo: form.archivo.name,
        anio: form.anio || new Date().getFullYear(),
        fecha: new Date().toLocaleDateString(),
        combinaciones: response.combinaciones || 
          (form.universidad.length * form.asignatura.length * form.profesor.length),
        idMaterial: idMaterial,  // ← AGREGAR ESTO
      });

      setLoading(false);
    } else {
      setSubmitError(response.message || "Error al subir el material");
      setLoading(false);
    }

    } catch (error) {
      console.error("Error en handleSubmit:", error);
      setSubmitError(error.message || "Error al subir el material");
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Validate required fields of step 1
    if (!form.asignatura || form.asignatura.length === 0) {
      setSubmitError("Por favor selecciona al menos una asignatura antes de continuar");
      return;
    }
    if (!form.universidad || form.universidad.length === 0) {
      setSubmitError("Por favor selecciona al menos una universidad antes de continuar");
      return;
    }
    if (!form.profesor || form.profesor.length === 0) {
      setSubmitError("Por favor selecciona al menos un profesor antes de continuar");
      return;
    }
    setSubmitError(null);
    setStep(2);
  };

  // Cuando cambia la asignatura seleccionada, cargamos materiales existentes
  useEffect(() => {
    const loadExisting = async () => {
      setExistingError(null);
      setExistingMateriales([]);
      if (!form.asignatura || form.asignatura.length === 0) return;
      const asignaturaId = form.asignatura[0];
      try {
        setLoadingExisting(true);
        const data = await articulosGeneralesService.obtenerMaterialesPorAsignatura(
          asignaturaId
        );
        setExistingMateriales(Array.isArray(data) ? data : []);
      } catch (err) {
        setExistingError("No se pudieron cargar materiales relacionados");
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExisting();
  }, [form.asignatura]);

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
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 1
                    ? "bg-yellow-500 text-red-700 font-semibold"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className="w-10 h-1 bg-gray-200" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step === 2
                    ? "bg-yellow-500 text-red-700 font-semibold"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
            </div>
            <div className="text-sm text-gray-600">Paso {step} de 2</div>
          </div>

          {/* Error message */}
          {submitError && <Alert type="error">{submitError}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Módulo 1: Universidad / Profesor / Asignatura */}
            {step === 1 && (
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-3 text-red-700">Metadatos - Parte 1</h4>
                <div className="grid grid-cols-1 gap-4">
                  <MultiSelect
                    label="Universidades *"
                    options={universidades.map((u) => ({
                      id: u.idUniversidad,
                      label: u.universidad,
                    }))}
                    selected={form.universidad}
                    onAdd={(id) =>
                      setForm({ ...form, universidad: [...form.universidad, id] })
                    }
                    onRemove={(id) =>
                      setForm({
                        ...form,
                        universidad: form.universidad.filter((u) => u !== id),
                      })
                    }
                  />

                  <MultiSelect
                    label="Profesores *"
                    options={profesores.map((p) => ({
                      id: p.idProfesor,
                      label: `${p.nombre} ${p.apellido}`,
                    }))}
                    selected={form.profesor}
                    onAdd={(id) =>
                      setForm({ ...form, profesor: [...form.profesor, id] })
                    }
                    onRemove={(id) =>
                      setForm({
                        ...form,
                        profesor: form.profesor.filter((p) => p !== id),
                      })
                    }
                  />

                  <MultiSelect
                    label="Asignatura *"
                    options={asignaturas.map((a) => ({
                      id: a.idAsignatura,
                      label: a.materia || a.nombre || `Asignatura ${a.idAsignatura}`,
                    }))}
                    selected={form.asignatura}
                    onAdd={(id) =>
                      setForm({ ...form, asignatura: [...form.asignatura, id] })
                    }
                    onRemove={(id) =>
                      setForm({
                        ...form,
                        asignatura: form.asignatura.filter((a) => a !== id),
                      })
                    }
                    required
                  />
                </div>

                {/* Materiales existentes para la primera asignatura seleccionada */}
                <div className="mt-3">
                  {loadingExisting ? (
                    <div className="text-sm text-gray-600">
                      Cargando materiales relacionados...
                    </div>
                  ) : existingError ? (
                    <Alert type="error">{existingError}</Alert>
                  ) : existingMateriales && existingMateriales.length > 0 ? (
                    <div className="bg-white border rounded p-3 mt-2">
                      <div className="text-sm font-semibold mb-2">
                        Materiales relacionados a la asignatura seleccionada
                      </div>
                      <ul className="text-sm text-gray-700 list-disc list-inside">
                        {existingMateriales.map((m) => (
                          <li key={m.idMaterial || m.id}>
                            {m.titulo || m.nombre || `Material ${m.idMaterial || m.id}`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mt-2">
                      No se encontraron materiales relacionados.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Módulo 2: Título / Año / Archivo */}
            {step === 2 && (
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-3 text-red-700">Metadatos - Parte 2</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={form.titulo}
                      onChange={(e) =>
                        setForm({ ...form, titulo: e.target.value })
                      }
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
                      onChange={(e) =>
                        setForm({ ...form, anio: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      placeholder="2025"
                      min="1900"
                      max="2100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Archivo *
                    </label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setForm({ ...form, archivo: e.target.files?.[0] })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
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
                  onClick={() => {
                    setSubmitError(null);
                    setStep(1);
                  }}
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

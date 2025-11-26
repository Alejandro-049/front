import { X } from "lucide-react";

export default function FilterModal({ isOpen, onClose, filters, setFilters, universidades, asignaturas, profesores }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal (sin overlay que oscurezca) */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filtros</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Universidad</label>
              <select
                value={filters.universidad}
                onChange={(e) => setFilters({ ...filters, universidad: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todas</option>
                {universidades.map((u) => (
                  <option key={u.idUniversidad} value={u.idUniversidad}>
                    {u.universidad}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Asignatura</label>
              <select
                value={filters.asignatura}
                onChange={(e) => setFilters({ ...filters, asignatura: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todas</option>
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
                value={filters.profesor}
                onChange={(e) => setFilters({ ...filters, profesor: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todos</option>
                {profesores.map((p) => (
                  <option key={p.idProfesor} value={p.idProfesor}>
                    {p.nombre} {p.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Año</label>
              <input
                type="text"
                value={filters.año}
                onChange={(e) => setFilters({ ...filters, año: e.target.value })}
                placeholder="ej: 2025-1"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <button
              onClick={onClose}
              className="w-full bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold mt-6"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

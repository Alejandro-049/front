import { useState, useEffect } from "react";
import Alert from "../components/Alert";

import { universidadService } from "../services/universidadService";
import { asignaturaService } from "../services/asignaturaService";
import { profesorService } from "../services/profesorService";
import { materialService } from "../services/materialService";

export default function BuscarMaterialPage() {
  const [filters, setFilters] = useState({
    universidad: '',
    profesor: '',
    asignatura: '',
    año: '',
    titulo: ''
  });
  const [resultados, setResultados] = useState([]);
  const [universidades, setUniversidades] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [univs, asigs, profs] = await Promise.all([
        universidadService.getAll(),
        asignaturaService.getAll(),
        profesorService.getAll()
      ]);
      setUniversidades(univs);
      setAsignaturas(asigs);
      setProfesores(profs);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar datos' });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await materialService.search(filters);
      setResultados(data);
      if (data.length === 0) {
        setMessage({ type: 'info', text: 'No se encontraron resultados' });
      } else {
        setMessage(null);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al buscar materiales' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Buscar Material Académico</h2>
      
      {message && <Alert type={message.type}>{message.text}</Alert>}
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Universidad</label>
              <select
                value={filters.universidad}
                onChange={(e) => setFilters({...filters, universidad: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todas</option>
                {universidades.map(u => (
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
                onChange={(e) => setFilters({...filters, asignatura: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todas</option>
                {asignaturas.map(a => (
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
                onChange={(e) => setFilters({...filters, profesor: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Todos</option>
                {profesores.map(p => (
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
                onChange={(e) => setFilters({...filters, año: e.target.value})}
                placeholder="ej: 2025-1"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={filters.titulo}
              onChange={(e) => setFilters({...filters, titulo: e.target.value})}
              placeholder="Buscar en el título..."
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <button type="submit" className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 font-semibold">
            Buscar
          </button>
        </form>
      </div>

      {resultados.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Resultados ({resultados.length})</h3>
          <div className="space-y-3">
            {resultados.map(material => (
              <div key={material.idMaterial} className="border rounded p-4">
                <h4 className="font-semibold text-lg mb-2">{material.titulo}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Año: {material.año}</div>
                  <div>Archivo: {material.ruta_archivo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

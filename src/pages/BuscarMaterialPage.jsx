import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import SearchBar from "../components/SearchBar";
import FilterModal from "../components/FilterModal";

import { universidadService } from "../services/universidadService";
import { asignaturaService } from "../services/asignaturaService";
import { profesorService } from "../services/profesorService";
import { materialService } from "../services/materialService";

export default function BuscarMaterialPage({ adminMode }) {
  const [query, setQuery] = useState("");
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
  const [showFilters, setShowFilters] = useState(false);

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

  const handleSearch = async (searchQuery = null) => {
    try {
      const searchParams = {
        ...filters,
        titulo: searchQuery !== null ? searchQuery : query,
      };
      const data = await materialService.search(searchParams);
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
    <div className="space-y-4">
      {adminMode && (
        <div className="inline-block bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold mb-4">
          Panel Admin
        </div>
      )}

      <h1 className="text-3xl font-bold">Buscar Material Académico</h1>

      {message && <Alert type={message.type}>{message.text}</Alert>}

      {/* SearchBar */}
      <SearchBar
        onSearch={handleSearch}
        onFilterToggle={() => setShowFilters(!showFilters)}
        query={query}
        setQuery={setQuery}
      />

      {/* FilterModal */}
      <FilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        universidades={universidades}
        asignaturas={asignaturas}
        profesores={profesores}
      />

      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            Resultados ({resultados.length})
          </h3>
          <div className="space-y-3">
            {resultados.map(material => (
              <div key={material.idMaterial} className="border rounded p-4 hover:shadow-md transition bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-red-700">{material.titulo}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Año: {material.año}</div>
                      <div>Archivo: {material.ruta_archivo}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        // simular descarga: guardar en localStorage
                        try {
                          const key = 'downloadedMaterials';
                          const existing = JSON.parse(localStorage.getItem(key) || '[]');
                          const already = existing.find((m) => m.idMaterial === material.idMaterial);
                          if (!already) {
                            existing.unshift({ idMaterial: material.idMaterial, titulo: material.titulo, año: material.año, ruta: material.ruta_archivo });
                            localStorage.setItem(key, JSON.stringify(existing));
                          }
                          alert('Descarga registrada en Mis Materiales');
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="bg-yellow-500 text-red-700 px-3 py-1 rounded font-semibold"
                    >
                      Descargar
                    </button>

                    {adminMode && (
                      <button className="bg-red-700 text-white px-3 py-1 rounded">Editar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

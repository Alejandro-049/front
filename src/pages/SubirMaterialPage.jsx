import { useState, useEffect } from "react";
import Alert from "../components/Alert";

import { universidadService } from "../services/universidadService";
import { asignaturaService } from "../services/asignaturaService";
import { profesorService } from "../services/profesorService";
import { materialService } from "../services/materialService";
export default function SubirMaterialPage() {
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    titulo: '',
    año: '',
    idUniversidad: '',
    idAsignatura: '',
    idProfesor: ''
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Debe seleccionar un archivo' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('titulo', form.titulo);
      formData.append('año', form.año);
      formData.append('idUniversidad', form.idUniversidad);
      formData.append('idAsignatura', form.idAsignatura);
      formData.append('idProfesor', form.idProfesor);

      await materialService.upload(formData);
      setMessage({ type: 'success', text: 'Material subido exitosamente' });
      setFile(null);
      setForm({ titulo: '', año: '', idUniversidad: '', idAsignatura: '', idProfesor: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al subir material' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Subir Material Académico</h2>
      
      {message && <Alert type={message.type}>{message.text}</Alert>}
      
      <div className="bg-white border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Archivo</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({...form, titulo: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Año (ej: 2025-1)</label>
            <input
              type="text"
              value={form.año}
              onChange={(e) => setForm({...form, año: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Universidad</label>
            <select
              value={form.idUniversidad}
              onChange={(e) => setForm({...form, idUniversidad: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione...</option>
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
              value={form.idAsignatura}
              onChange={(e) => setForm({...form, idAsignatura: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione...</option>
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
              value={form.idProfesor}
              onChange={(e) => setForm({...form, idProfesor: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Seleccione...</option>
              {profesores.map(p => (
                <option key={p.idProfesor} value={p.idProfesor}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Subir Material
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import { profesorService } from "../services/profesorService";

export default function ProfesoresPage({ adminMode }) {
  const [profesores, setProfesores] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadProfesores();
  }, []);

  const loadProfesores = async () => {
    try {
      const data = await profesorService.getAll();
      setProfesores(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar profesores' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await profesorService.create(form);
      setMessage({ type: 'success', text: 'Profesor creado' });
      setForm({ nombre: '', apellido: '' });
      loadProfesores();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear profesor' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este profesor?')) {
      try {
        await profesorService.delete(id);
        setMessage({ type: 'success', text: 'Profesor eliminado' });
        loadProfesores();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al eliminar profesor' });
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Profesores</h2>
      
      {message && <Alert type={message.type}>{message.text}</Alert>}

      {adminMode ? (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Nuevo Profesor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({...form, nombre: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                value={form.apellido}
                onChange={(e) => setForm({...form, apellido: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold">
              Crear Profesor
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-yellow-50 border-yellow-200 text-yellow-800 rounded p-4 mb-6">
          Modo lectura: No tienes permisos para crear profesores.
        </div>
      )}

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Profesores Registrados</h3>
        <div className="space-y-2">
          {profesores.map(prof => (
            <div key={prof.idProfesor} className="flex justify-between items-center p-3 border rounded">
              <div className="font-medium">{prof.nombre} {prof.apellido}</div>
              {adminMode ? (
                <button 
                  onClick={() => handleDelete(prof.idProfesor)}
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

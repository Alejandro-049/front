import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import { universidadService } from "../services/universidadService";

export default function UniversidadesPage() {
  const [universidades, setUniversidades] = useState([]);
  const [form, setForm] = useState({ universidad: '', ciudad: '' });
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadUniversidades();
  }, []);

  const loadUniversidades = async () => {
    try {
      const data = await universidadService.getAll();
      setUniversidades(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar universidades' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await universidadService.update(editing, form);
        setMessage({ type: 'success', text: 'Universidad actualizada' });
      } else {
        await universidadService.create(form);
        setMessage({ type: 'success', text: 'Universidad creada' });
      }
      setForm({ universidad: '', ciudad: '' });
      setEditing(null);
      loadUniversidades();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar universidad' });
    }
  };

  const handleEdit = (univ) => {
    setForm({ universidad: univ.universidad, ciudad: univ.ciudad });
    setEditing(univ.idUniversidad);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar esta universidad?')) {
      try {
        await universidadService.delete(id);
        setMessage({ type: 'success', text: 'Universidad eliminada' });
        loadUniversidades();
      } catch (error) {
        setMessage({ type: 'error', text: 'Error al eliminar universidad' });
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Universidades</h2>
      
      {message && <Alert type={message.type}>{message.text}</Alert>}
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editing ? 'Editar Universidad' : 'Nueva Universidad'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              value={form.universidad}
              onChange={(e) => setForm({...form, universidad: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              value={form.ciudad}
              onChange={(e) => setForm({...form, ciudad: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {editing ? 'Actualizar' : 'Crear'}
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => { setEditing(null); setForm({ universidad: '', ciudad: '' }); }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Universidades Registradas</h3>
        <div className="space-y-2">
          {universidades.map(univ => (
            <div key={univ.idUniversidad} className="flex justify-between items-center p-3 border rounded">
              <div>
                <div className="font-medium">{univ.universidad}</div>
                <div className="text-sm text-gray-600">{univ.ciudad}</div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(univ)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(univ.idUniversidad)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

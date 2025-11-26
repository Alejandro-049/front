import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Star } from "lucide-react";
import Alert from "../components/Alert";
import UploadMaterialModal from "../components/UploadMaterialModal";

export default function MisMaterialesSubidosPage({ userRole }) {
  const [materiales, setMateriales] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadMateriales();
  }, []);

  const loadMateriales = () => {
    try {
      const key = "uploadedMaterials";
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      setMateriales(stored);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("¿Eliminar este material?")) {
      try {
        const key = "uploadedMaterials";
        const updated = materiales.filter((m) => m.id !== id);
        localStorage.setItem(key, JSON.stringify(updated));
        setMateriales(updated);
        setMessage({ type: "success", text: "Material eliminado" });
      } catch (err) {
        setMessage({ type: "error", text: "Error al eliminar material" });
      }
    }
  };

  const handleAddMaterial = (newMaterial) => {
    try {
      const key = "uploadedMaterials";
      const id = Date.now(); // ID simple basado en timestamp
      const materialWithId = { ...newMaterial, id };
      const updated = [materialWithId, ...materiales];
      localStorage.setItem(key, JSON.stringify(updated));
      setMateriales(updated);
      setMessage({ type: "success", text: "Material subido exitosamente" });
      setShowUploadModal(false);
    } catch (err) {
      setMessage({ type: "error", text: "Error al subir material" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-700">Mis Materiales Subidos</h1>
          <p className="text-gray-600">({materiales.length} material{materiales.length !== 1 ? "es" : ""})</p>
        </div>
      </div>

      {message && <Alert type={message.type}>{message.text}</Alert>}

      {materiales.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-600">
          <p>No has subido materiales aún.</p>
          <p className="text-sm mt-2">Haz clic en el botón flotante (+) para subir tu primer material.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {materiales.map((material) => (
            <div key={material.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-700">{material.titulo}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mt-2">
                    <div>📚 Asignatura: {material.asignatura || "N/A"}</div>
                    <div>👨‍🏫 Profesor: {material.profesor || "N/A"}</div>
                    <div>🏫 Universidad: {material.universidad || "N/A"}</div>
                    <div>📅 Fecha: {material.fecha || "N/A"}</div>
                    {material.categoria && <div>🏷️ Categoría: {material.categoria}</div>}
                    {material.detalles && <div>📝 Detalles: {material.detalles}</div>}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => alert("Funcionalidad de valoración próximamente")}
                    className="bg-yellow-500 text-red-700 px-3 py-2 rounded hover:bg-yellow-400 flex items-center gap-1 font-semibold"
                  >
                    <Star size={16} /> Valorar
                  </button>
                  <button
                    onClick={() => alert("Descargando: " + material.titulo)}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-1 font-semibold"
                  >
                    <Download size={16} /> Descargar
                  </button>
                  <button
                    onClick={() => handleDeleteMaterial(material.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón flotante (+) */}
      <button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-yellow-500 text-red-700 rounded-full shadow-lg hover:bg-yellow-400 flex items-center justify-center font-bold text-3xl transition"
        aria-label="Subir nuevo material"
      >
        +
      </button>

      {/* Modal de subida */}
      {showUploadModal && (
        <UploadMaterialModal
          onClose={() => setShowUploadModal(false)}
          onSubmit={handleAddMaterial}
          userRole={userRole}
        />
      )}
    </div>
  );
}

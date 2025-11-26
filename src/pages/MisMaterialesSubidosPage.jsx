import { useState, useEffect } from "react";
import { Plus, Trash2, Download, Star } from "lucide-react";
import Alert from "../components/Alert";
import UploadMaterialModal from "../components/UploadMaterialModal";

export default function MisMaterialesSubidosPage({ adminMode }) {
  const [materiales, setMateriales] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentUserId] = useState(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = `user_${Date.now()}`;
      localStorage.setItem("userId", userId);
    }
    return userId;
  });

  useEffect(() => {
    loadMateriales();
  }, []); 

  const loadMateriales = async () => {
  try {
    const response = await fetch('http://localhost:8081/unicloud/materiales');
    if (!response.ok) {
      setMessage({ type: "error", text: "Error al cargar materiales" });
      return;
    }
    
    let materiales = await response.json();
    
    // Enriquecer cada material con sus artículos
    const materialesEnriquecidos = await Promise.all(
      materiales.map(async (material) => {
        try {
          // Obtener artículos del material
          const articlesResponse = await fetch(
            `http://localhost:8081/unicloud/articulos-generales`
          );
          
          if (articlesResponse.ok) {
            const todosArticulos = await articlesResponse.json();
            const articulosMaterial = todosArticulos.filter(
              (art) => art.materialId === material.idMaterial
            );
            
            // Obtener asignaturas, profesores y universidades
            const asignaturasSet = new Set();
            const profesoresSet = new Set();
            const universidadesSet = new Set();
            
            for (const articulo of articulosMaterial) {
              // Obtener asignatura
              if (articulo.asignaturaId) {
                const asigResponse = await fetch(
                  `http://localhost:8081/unicloud/asignaturas/${articulo.asignaturaId}`
                );
                if (asigResponse.ok) {
                  const asignatura = await asigResponse.json();
                  asignaturasSet.add(asignatura.materia);
                }
              }
              
              // Obtener profesor
              if (articulo.profesorId) {
                const profResponse = await fetch(
                  `http://localhost:8081/unicloud/profesores/${articulo.profesorId}`
                );
                if (profResponse.ok) {
                  const profesor = await profResponse.json();
                  profesoresSet.add(`${profesor.nombre} ${profesor.apellido}`);
                }
              }
              
              // Obtener universidad
              if (articulo.universidadId) {
                const univResponse = await fetch(
                  `http://localhost:8081/unicloud/universidades/${articulo.universidadId}`
                );
                if (univResponse.ok) {
                  const universidad = await univResponse.json();
                  universidadesSet.add(universidad.universidad);
                }
              }
            }
            
            return {
              ...material,
              asignatura: Array.from(asignaturasSet),
              profesor: Array.from(profesoresSet),
              universidad: Array.from(universidadesSet),
              fecha: new Date().toLocaleDateString()
            };
          }
          
          return material;
        } catch (err) {
          console.error(`Error enriqueciendo material ${material.idMaterial}:`, err);
          return material;
        }
      })
    );
    
    setMateriales(materialesEnriquecidos);
  } catch (err) {
    console.error(err);
    setMessage({ type: "error", text: "Error al cargar materiales" });
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

  const handleDownloadMaterial = async (material) => {
  try {
    const response = await fetch(
      `http://localhost:8081/unicloud/materiales/${material.idMaterial}/descargar`
    );

    if (!response.ok) {
      alert('Error al descargar el archivo');
      return;
    }

    // Obtener el nombre del archivo del header Content-Disposition
    const contentDisposition = response.headers.get('Content-Disposition');
    let nombreArchivo = material.titulo || 'archivo';
    
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="([^"]+)"/);
      if (matches && matches[1]) {
        nombreArchivo = matches[1];
      }
    }

    // ← AGREGAR EXTENSIÓN SI NO LA TIENE
    if (!nombreArchivo.includes('.')) {
      nombreArchivo = nombreArchivo + '.pdf';
    }

    // Obtener el blob (contenido binario del archivo)
    const blob = await response.blob();

    // Crear un URL temporal
    const url = window.URL.createObjectURL(blob);

    // Crear un link temporal y hacer clic para descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    // Registrar en localStorage (opcional)
    const key = 'downloadedMaterials';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const already = existing.find((m) => m.idMaterial === material.idMaterial);
    if (!already) {
      existing.unshift({
        idMaterial: material.idMaterial,
        titulo: material.titulo,
        año: material.año,
        descargadoEn: new Date().toISOString()
      });
      localStorage.setItem(key, JSON.stringify(existing));
    }

    setMessage({ type: "success", text: `Descargando: ${nombreArchivo}` });
  } catch (err) {
    console.error('Error en descarga:', err);
    setMessage({ type: "error", text: 'Error al descargar: ' + err.message });
  }
};


  const handleAddMaterial = (newMaterial) => {
    try {
      const key = "uploadedMaterials";
      const id = Date.now();
      const materialWithId = { 
        ...newMaterial, 
        id, 
        userId: currentUserId,
        asignatura: Array.isArray(newMaterial.asignatura) ? newMaterial.asignatura : [newMaterial.asignatura],
        profesor: Array.isArray(newMaterial.profesor) ? newMaterial.profesor : [newMaterial.profesor],
        universidad: Array.isArray(newMaterial.universidad) ? newMaterial.universidad : [newMaterial.universidad],
      };
      
      const updated = [materialWithId, ...materiales];
      localStorage.setItem(key, JSON.stringify(updated));
      setMateriales(updated);
      setMessage({ type: "success", text: "Material subido exitosamente" });
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
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
                    <div>Asignatura: {Array.isArray(material.asignatura) ? material.asignatura.join(", ") : (material.asignatura || "N/A")}</div>
                    <div>Profesor: {Array.isArray(material.profesor) ? material.profesor.join(", ") : (material.profesor || "N/A")}</div>
                    <div>Universidad: {Array.isArray(material.universidad) ? material.universidad.join(", ") : (material.universidad || "N/A")}</div>
                    <div>Fecha: {material.fecha || "N/A"}</div>
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
                    onClick={() => handleDownloadMaterial(material)}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-1 font-semibold"
                  >
                    <Download size={16} /> Descargar
                  </button>
                  {(adminMode || material.userId === currentUserId) && (
                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 size={16} /> Eliminar
                    </button>
                  )}
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
          adminMode={adminMode}
        />
      )}
    </div>
  );
}

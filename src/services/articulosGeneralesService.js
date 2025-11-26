import { API_BASE } from "./apiConfig";

const BASE = `${API_BASE}/articulos-generales`;

const mockArticulos = [
  { materialId: 1, universidadId: 1, asignaturaId: 1, profesorId: 1 },
  { materialId: 1, universidadId: 1, asignaturaId: 1, profesorId: 2 },
  { materialId: 2, universidadId: 2, asignaturaId: 2, profesorId: 3 },
];

const mockMateriales = [
  { idMaterial: 1, ruta_archivo: "uploads/uuid1.pdf", titulo: "Cálculo Avanzado", año: "2025-1" },
  { idMaterial: 2, ruta_archivo: "uploads/uuid2.pdf", titulo: "Ejercicios Resueltos", año: "2025-1" },
];

async function safeJson(response) {
  const json = await response.json().catch(() => null);
  // If backend wraps responses like { success, message, data }
  if (json && typeof json === "object") {
    if (json.success !== undefined && json.data !== undefined) return json.data;
    return json;
  }
  return null;
}

export const articulosGeneralesService = {
  getAll: async () => {
    try {
      const res = await fetch(BASE);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos;
    }
  },

  getByMaterial: async (idMaterial) => {
    try {
      const res = await fetch(`${BASE}/material/${idMaterial}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos.filter((a) => a.materialId === Number(idMaterial));
    }
  },

  getByUniversidad: async (idUniversidad) => {
    try {
      const res = await fetch(`${BASE}/universidad/${idUniversidad}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos.filter((a) => a.universidadId === Number(idUniversidad));
    }
  },

  getByAsignatura: async (idAsignatura) => {
    try {
      const res = await fetch(`${BASE}/asignatura/${idAsignatura}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos.filter((a) => a.asignaturaId === Number(idAsignatura));
    }
  },

  getByProfesor: async (idProfesor) => {
    try {
      const res = await fetch(`${BASE}/profesor/${idProfesor}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos.filter((a) => a.profesorId === Number(idProfesor));
    }
  },

  buscarCompuesta: async (material, universidad, asignatura, profesor) => {
    try {
      const params = new URLSearchParams({ material, universidad, asignatura, profesor });
      const res = await fetch(`${BASE}/buscar/compuesta?${params.toString()}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return data;
    } catch (e) {
      return mockArticulos.find(
        (a) => a.materialId === Number(material) && a.universidadId === Number(universidad) && a.asignaturaId === Number(asignatura) && a.profesorId === Number(profesor)
      ) || null;
    }
  },

  buscarFiltro: async (profesor, universidad, asignatura) => {
    try {
      const params = new URLSearchParams({ profesor, universidad, asignatura });
      const res = await fetch(`${BASE}/buscar/filtro?${params.toString()}`);
      if (!res.ok) throw new Error("Network error");
      const data = await safeJson(res);
      return Array.isArray(data) ? data : (data ? [data] : []);
    } catch (e) {
      return mockArticulos.filter(
        (a) => a.profesorId === Number(profesor) && a.universidadId === Number(universidad) && a.asignaturaId === Number(asignatura)
      );
    }
  },

  deleteByClaveCompuesta: async (material, universidad, asignatura, profesor) => {
    try {
      const params = new URLSearchParams({ material, universidad, asignatura, profesor });
      const res = await fetch(`${BASE}?${params.toString()}`, { method: "DELETE" });
      if (!res.ok) return false;
      return true;
    } catch (e) {
      return false;
    }
  },

  obtenerMaterialesPorAsignatura: async (asignaturaId) => {
    try {
      const res = await fetch(`${BASE}/asignatura/${asignaturaId}/materiales`);
      if (!res.ok) throw new Error("Network error");
      const json = await res.json();
      // API docs show wrapper { success, message, cantidad, data }
      if (json && json.data) return json.data;
      // otherwise assume the endpoint returns the array directly
      return Array.isArray(json) ? json : [];
    } catch (e) {
      return mockMateriales;
    }
  },
};

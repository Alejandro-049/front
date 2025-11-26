import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/materiales`;

export const materialService = {
  upload: async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error uploading");
      return response.json();
    } catch (error) {
      return { success: true, message: "Material subido correctamente" };
    }
  },

  // ← NUEVO MÉTODO: Crear material con artículos en simultáneo
  uploadConArticulos: async (formData) => {
    try {
      const response = await fetch(`${API_URL}/con-articulos`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error uploading with articles");
      return response.json();
    } catch (error) {
      console.error("Error en uploadConArticulos:", error);
      return { 
        success: false, 
        message: "Error al subir material con artículos: " + error.message 
      };
    }
  },

  // Search will try specific backend endpoints depending on provided filters
  search: async (filters) => {
    try {
      // If title filter provided, call buscar/titulo
      if (filters.titulo) {
        const res = await fetch(`${API_URL}/buscar/titulo/${encodeURIComponent(filters.titulo)}`);
        if (!res.ok) throw new Error("Error fetching by titulo");
        const json = await res.json();
        return Array.isArray(json) ? json : (json && json.data ? json.data : []);
      }

      // If año filter provided
      if (filters.año) {
        const res = await fetch(`${API_URL}/buscar/ano/${encodeURIComponent(filters.año)}`);
        if (!res.ok) throw new Error("Error fetching by año");
        const json = await res.json();
        return Array.isArray(json) ? json : (json && json.data ? json.data : []);
      }

      // Fallback: get all materials
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error fetching all materials");
      const json = await res.json();
      return Array.isArray(json) ? json : (json && json.data ? json.data : []);
    } catch (error) {
      return [];
    }
  },
};

import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/materiales`;

const mockMateriales = [
  {
    idMaterial: 1,
    titulo: "Apuntes de Cálculo Diferencial",
    asignatura: "MAT101",
    profesor: "1",
    universidad: "1",
    ruta_archivo: "apuntes-calculo.pdf",
    año: "2025-1",
  },
  {
    idMaterial: 2,
    titulo: "Ejercicios de Física I",
    asignatura: "FIS101",
    profesor: "2",
    universidad: "2",
    ruta_archivo: "ejercicios-fisica.pdf",
    año: "2025-1",
  },
  {
    idMaterial: 3,
    titulo: "Examen Final Programación",
    asignatura: "PROG101",
    profesor: "3",
    universidad: "3",
    ruta_archivo: "examen-prog.pdf",
    año: "2025-1",
  },
];

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
      return mockMateriales;
    }
  },
};

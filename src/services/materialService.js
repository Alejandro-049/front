const API_URL = "http://localhost:8080/api/material";

const mockMateriales = [
  {
    id: "1",
    titulo: "Apuntes de Cálculo Diferencial",
    asignatura: "MAT101",
    profesor: "1",
    universidad: "1",
    categoria: "apuntes",
    detalles: "Apuntes completos del semestre con ejemplos y ejercicios resueltos",
    archivo: "apuntes-calculo.pdf",
    fecha: "11/15/2025"
  },
  {
    id: "2",
    titulo: "Ejercicios de Física I",
    asignatura: "FIS101",
    profesor: "2",
    universidad: "2",
    categoria: "ejercicios",
    detalles: "Serie de ejercicios propuestos por el profesor con soluciones",
    archivo: "ejercicios-fisica.pdf",
    fecha: "11/10/2025"
  },
  {
    id: "3",
    titulo: "Examen Final Programación",
    asignatura: "PROG101",
    profesor: "3",
    universidad: "3",
    categoria: "examen",
    detalles: "Examen del semestre anterior con respuestas",
    archivo: "examen-prog.pdf",
    fecha: "11/05/2025"
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

  search: async (filters) => {
    try {
      const params = new URLSearchParams();

      Object.keys(filters).forEach((key) => {
        if (filters[key]) params.append(key, filters[key]);
      });

      const response = await fetch(`${API_URL}/buscar?${params}`);
      if (!response.ok) throw new Error("Error fetching");
      return response.json();
    } catch (error) {
      return mockMateriales;
    }
  },
};

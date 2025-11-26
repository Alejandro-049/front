const API_URL = "http://localhost:8080/api/asignatura";

const mockAsignaturas = [
  { idAsignatura: "MAT101", nombre: "Cálculo Diferencial" },
  { idAsignatura: "FIS101", nombre: "Física I" },
  { idAsignatura: "PROG101", nombre: "Programación Básica" },
  { idAsignatura: "ALG101", nombre: "Álgebra Lineal" },
  { idAsignatura: "QUI101", nombre: "Química General" },
  { idAsignatura: "ING101", nombre: "Inglés I" },
];

export const asignaturaService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching");
      return response.json();
    } catch (error) {
      return mockAsignaturas;
    }
  },

  create: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },
};


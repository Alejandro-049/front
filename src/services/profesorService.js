const API_URL = "http://localhost:8080/api/profesor";

const mockProfesores = [
  { idProfesor: "1", nombre: "Carlos", apellido: "Mendoza" },
  { idProfesor: "2", nombre: "María", apellido: "García" },
  { idProfesor: "3", nombre: "Juan", apellido: "Pérez" },
  { idProfesor: "4", nombre: "Ana", apellido: "López" },
  { idProfesor: "5", nombre: "Roberto", apellido: "Sánchez" },
];

export const profesorService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching");
      return response.json();
    } catch (error) {
      return mockProfesores;
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


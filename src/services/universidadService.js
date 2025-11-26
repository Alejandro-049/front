const API_URL = "http://localhost:8080/api/universidad";

const mockUniversidades = [
  { idUniversidad: "1", universidad: "Universidad Nacional Autónoma de México (UNAM)" },
  { idUniversidad: "2", universidad: "Instituto Politécnico Nacional (IPN)" },
  { idUniversidad: "3", universidad: "Universidad de Guadalajara (UdeG)" },
  { idUniversidad: "4", universidad: "Tecnológico de Monterrey (ITESM)" },
  { idUniversidad: "5", universidad: "Universidad Autónoma de Nuevo León (UANL)" },
];

export const universidadService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching");
      return response.json();
    } catch (error) {
      return mockUniversidades;
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

  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
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

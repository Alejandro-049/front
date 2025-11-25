const API_URL = "http://localhost:8080/api/asignatura";

export const asignaturaService = {
  getAll: async () => {
    const response = await fetch(API_URL);
    return response.json();
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


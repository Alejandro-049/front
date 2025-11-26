import { API_BASE } from "./apiConfig";

const API_URL = `${API_BASE}/profesores`;

export const profesorService = {
  getAll: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error fetching");
      const json = await response.json();
      return Array.isArray(json) ? json : (json && json.data ? json.data : []);
    } catch (error) {
      // No mock data: return empty list on error
      return [];
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


const API_URL = "http://localhost:8080/api/material";

export const materialService = {
  upload: async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  search: async (filters) => {
    const params = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) params.append(key, filters[key]);
    });

    const response = await fetch(`${API_URL}/buscar?${params}`);
    return response.json();
  },
};

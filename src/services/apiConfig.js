// Default API base points to the backend shown in your controllers
// Change by setting VITE_API_BASE in a .env file (e.g. VITE_API_BASE=http://localhost:8081/unicloud)
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8081/unicloud";

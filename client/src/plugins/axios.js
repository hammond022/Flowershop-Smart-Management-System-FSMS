import axios from "axios";

// NOTE: using absolute backend URL for development. Change to env var if needed.
const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Attach token if present
api.interceptors.request.use((config) => {
  try {
    let token = localStorage.getItem("token");
    if (!token) token = sessionStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;

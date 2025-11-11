import axios from "axios";
import { auth } from "@/auth.js";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  if (auth.credentials) {
    config.headers.Authorization = `Basic ${auth.credentials}`;
  }
  return config;
});

export default api;

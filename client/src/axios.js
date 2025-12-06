import axios from "axios";
import { auth } from "@/auth.js";
import { API_BASE_URL } from "@/api/base.js";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  if (auth.credentials) {
    config.headers.Authorization = `Basic ${auth.credentials}`;
  }
  return config;
});

export default api;

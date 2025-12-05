// src/auth.js
import { reactive } from "vue";
import { API_BASE_URL } from "@/api/base.js";

export const API_BASE = API_BASE_URL;

export const auth = reactive({
  user: null,
  isAuthenticated: false,
  credentials: null,
  error: null,

  async login(username, password) {
    try {
      const token = btoa(`${username}:${password}`);
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      this.user = data;
      this.isAuthenticated = true;
      this.credentials = token;
      this.error = null;

      // optional: persist
      localStorage.setItem("authToken", token);
      return data;
    } catch (err) {
      this.user = null;
      this.isAuthenticated = false;
      this.error = err.message;
      localStorage.removeItem("authToken");
    }
  },

  logout() {
    this.user = null;
    this.isAuthenticated = false;
    this.credentials = null;
    this.error = null;
    localStorage.removeItem("authToken");
  },

  async init() {
    // restore session if token exists
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Basic ${token}` },
      });
      if (!res.ok) throw new Error("Session expired");
      const data = await res.json();
      this.user = data;
      this.credentials = token;
      this.isAuthenticated = true;
    } catch {
      this.logout();
    }
  },

  async apiRequest(method, endpoint, body = null) {
    const opts = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (this.credentials) {
      opts.headers["Authorization"] = `Basic ${this.credentials}`;
    }

    if (body) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Error ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
  },

  can(resource, action) {
    return this.user?.role?.[resource]?.[action] === true;
  },

  async checkDatabaseStatus() {
    try {
      const res = await fetch(`${API_BASE}/onboarding/status`);
      if (!res.ok) throw new Error("Failed to check database status");
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error checking database status:", error);
      return { isEmpty: false, userCount: 0 };
    }
  },
});

// src/auth.js
import { reactive } from "vue";

const API_BASE = "http://localhost:3000/api";

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
    // Check if onboarding is needed
    try {
      const statusRes = await fetch(`${API_BASE}/onboarding/status`);
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.isEmpty) {
          // Database is empty, onboarding is needed
          return;
        }
      }
    } catch (err) {
      console.warn("Could not check onboarding status:", err);
    }

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
});

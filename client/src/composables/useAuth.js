import { ref } from "vue";
import api from "@/plugins/axios";

// Try to hydrate user from localStorage or sessionStorage
function readStoredUser() {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    return JSON.parse(raw || "null");
  } catch (e) {
    return null;
  }
}

const user = ref(readStoredUser());

function saveAuth(token, u, remember = true) {
  if (remember) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(u));
    // remove any session storage copies
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(u));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  user.value = u;
}

export default function useAuth() {
  async function login(email, password, remember = true) {
    const res = await api.post("/api/auth/login", { email, password });
    saveAuth(res.data.token, res.data.user, remember);
    return res.data;
  }

  async function register(name, email, password, role = "cashier", remember = true) {
    const res = await api.post("/api/auth/register", { name, email, password, role });
    saveAuth(res.data.token, res.data.user, remember);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    user.value = null;
  }

  async function forgotPassword(email) {
    const res = await api.post("/api/auth/forgot", { email });
    return res.data;
  }

  const isAuthenticated = () => !!user.value;

  return {
    user,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated,
  };
}

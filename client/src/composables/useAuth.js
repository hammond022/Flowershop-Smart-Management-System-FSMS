import { ref } from "vue";
import { useRouter } from "vue-router";

export function useAuth() {
  const router = useRouter();
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);

  const login = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("user");
    router.push({ name: "Login" });
  };

  const isLoggedIn = () => !!user.value;

  return { user, login, logout, isLoggedIn };
}

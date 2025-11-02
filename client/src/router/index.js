import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PosView from "@/views/PosView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import InventoryView from "@/views/InventoryView.vue";
import SettingsView from "@/views/SettingsView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ForgotPasswordView from "@/views/ForgotPasswordView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/pos",
      name: "pos",
      component: PosView,
    },
    {
      path: "/transactions",
      name: "transactions",
      component: TransactionsView,
    },
    {
      path: "/inventory",
      name: "inventory",
      component: InventoryView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/forgot",
      name: "forgot",
      component: ForgotPasswordView,
    },
  ],
});

// Navigation guard: send unauthenticated users to /login
const publicPages = ["/login", "/register", "/forgot"];
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  // If no token and trying to access a protected page -> redirect to login
  if (!token && !publicPages.includes(to.path)) {
    return next({ path: "/login" });
  }
  // If token exists and user tries to access auth pages, redirect to home
  if (token && publicPages.includes(to.path)) {
    return next({ path: "/" });
  }
  next();
});

export default router;

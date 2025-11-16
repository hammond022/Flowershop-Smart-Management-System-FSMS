import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PosView from "@/views/PosView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import InventoryView from "@/views/InventoryView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ChangePasswordView from "@/views/ChangePasswordView.vue";
import LoginView from "@/components/UserAuth/Login.vue";
import Overview from "@/components/Inventory/Overview.vue";
import Products from "@/components/Inventory/Products.vue";
import PurchaseOrders from "@/components/Inventory/PurchaseOrders.vue";
import Sales from "@/components/Inventory/Sales.vue";

import { auth } from "@/auth.js";

const routes = [
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: "/pos",
    name: "pos",
    component: PosView,
    meta: { requiresAuth: true },
  },
  {
    path: "/transactions",
    name: "transactions",
    component: TransactionsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/inventory",
    name: "inventory",
    component: InventoryView,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePasswordView,
    meta: { requiresAuth: true },
  },
  {
    path: "/inventory",
    component: InventoryView,
    children: [
      {
        path: "overview",
        name: "InventoryOverview",
        component: Overview,
      },
      {
        path: "products",
        name: "InventoryProducts",
        component: Products,
      },
      {
        path: "purchase-orders",
        name: "InventoryPurchaseOrders",
        component: PurchaseOrders,
      },
      {
        path: "sales",
        name: "InventorySales",
        component: Sales,
      },
      {
        path: "",
        redirect: { name: "InventoryOverview" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Global route guard
router.beforeEach(async (to, from, next) => {
  // Initialize auth (check localStorage token)
  if (!auth.isAuthenticated) await auth.init();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Redirect to login and save intended route
    next({ name: "login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;

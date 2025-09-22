import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PosView from "@/views/PosView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import InventoryView from "@/views/InventoryView.vue";
import SettingsView from "@/views/SettingsView.vue";

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
  ],
});

export default router;

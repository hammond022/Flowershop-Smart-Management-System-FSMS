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
import CustomBouquets from "@/components/Inventory/CustomBouquets.vue";
import DocumentationLayout from "@/components/documentation/DocumentationLayout.vue";
import Introduction from "@/components/documentation/Introduction.vue";
import CreatingProducts from "@/components/documentation/CreatingProducts.vue";
import CreatingPurchaseOrders from "@/components/documentation/CreatingPurchaseOrders.vue";
import CreatingTransactions from "@/components/documentation/CreatingTransactions.vue";
import ProductsDoc from "@/components/documentation/Products.vue";
import TransactionsDoc from "@/components/documentation/Transactions.vue";
import PurchaseOrdersDoc from "@/components/documentation/PurchaseOrders.vue";
import ResolvingPendingTransaction from "@/components/documentation/ResolvingPendingTransaction.vue";
import AddingDiscounts from "@/components/documentation/AddingDiscounts.vue";
import PrintingTransactions from "@/components/documentation/PrintingTransactions.vue";
import DeletingProducts from "@/components/documentation/DeletingProducts.vue";
import ExportingPurchaseOrderReports from "@/components/documentation/ExportingPurchaseOrderReports.vue";
import CreatingCustomBouquet from "@/components/documentation/CreatingCustomBouquet.vue";
import UpdatingCustomBouquet from "@/components/documentation/UpdatingCustomBouquet.vue";

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
    path: "/documentation",
    component: DocumentationLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "introduction",
        name: "DocIntroduction",
        component: Introduction,
      },
      {
        path: "creating-products",
        name: "DocCreatingProducts",
        component: CreatingProducts,
      },
      {
        path: "creating-purchase-orders",
        name: "DocCreatingPurchaseOrders",
        component: CreatingPurchaseOrders,
      },
      {
        path: "creating-transactions",
        name: "DocCreatingTransactions",
        component: CreatingTransactions,
      },
      {
        path: "products",
        name: "DocProducts",
        component: ProductsDoc,
      },
      {
        path: "deleting-products",
        name: "DocDeletingProducts",
        component: DeletingProducts,
      },
      {
        path: "creating-custom-bouquet",
        name: "DocCreatingCustomBouquet",
        component: CreatingCustomBouquet,
      },
      {
        path: "updating-custom-bouquet",
        name: "DocUpdatingCustomBouquet",
        component: UpdatingCustomBouquet,
      },
      {
        path: "transactions",
        name: "DocTransactions",
        component: TransactionsDoc,
      },
      {
        path: "purchase-orders",
        name: "DocPurchaseOrders",
        component: PurchaseOrdersDoc,
      },
      {
        path: "exporting-purchase-order-reports",
        name: "DocExportingPurchaseOrderReports",
        component: ExportingPurchaseOrderReports,
      },
      {
        path: "resolving-pending-transaction",
        name: "DocResolvingPendingTransaction",
        component: ResolvingPendingTransaction,
      },
      {
        path: "adding-discounts",
        name: "DocAddingDiscounts",
        component: AddingDiscounts,
      },
      {
        path: "printing-transactions",
        name: "DocPrintingTransactions",
        component: PrintingTransactions,
      },
      {
        path: "",
        redirect: { name: "DocIntroduction" },
      },
    ],
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
        path: "custom-bouquets",
        name: "InventoryCustomBouquets",
        component: CustomBouquets,
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

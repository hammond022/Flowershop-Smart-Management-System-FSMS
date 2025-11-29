import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PosView from "@/views/PosView.vue";
import TransactionsView from "@/views/TransactionsView.vue";
import InventoryView from "@/views/InventoryView.vue";
import SettingsView from "@/views/SettingsView.vue";
import ChangePasswordView from "@/views/ChangePasswordView.vue";
import DatabaseManagementView from "@/views/DatabaseManagementView.vue";
import LoginView from "@/components/UserAuth/Login.vue";
import OnboardingView from "@/components/UserAuth/Onboarding.vue";
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
import UpdateProducts from "@/components/documentation/UpdateProducts.vue";

import { auth, API_BASE } from "@/auth.js";

// Cache for onboarding status to avoid repeated API calls
let onboardingStatusCache = null;

// Function to reset the onboarding cache (call after successful onboarding)
export function resetOnboardingCache() {
  onboardingStatusCache = false;
}

const routes = [
  { path: "/onboarding", name: "onboarding", component: OnboardingView },
  { path: "/login", name: "login", component: LoginView },
  {
    path: "/",
    redirect: { name: "InventoryOverview" },
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
    path: "/database-management",
    name: "database-management",
    component: DatabaseManagementView,
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
        path: "update-products",
        name: "DocUpdateProducts",
        component: UpdateProducts,
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
  // Check if onboarding is needed FIRST (before any redirects)
  // Use cached status to avoid API call on every navigation
  if (to.name !== "onboarding" && to.name !== "login") {
    if (onboardingStatusCache === null) {
      try {
        const statusRes = await fetch(`${API_BASE}/onboarding/status`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          onboardingStatusCache = statusData.isEmpty;
        } else {
          onboardingStatusCache = false;
        }
      } catch (err) {
        console.warn("Could not check onboarding status:", err);
        onboardingStatusCache = false;
      }
    }
    
    if (onboardingStatusCache === true) {
      // Database is empty, redirect to onboarding
      next({ name: "onboarding" });
      return;
    }
  }

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

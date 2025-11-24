<script setup>
import { ref } from "vue";

const sidebarSelected = ref("overview");
function selectSidebar(selected) {
  sidebarSelected.value = selected;
}
</script>

<template>
  <div class="d-flex">
    <aside
      class="d-flex flex-column flex-shrink-0 p-3 bg-light"
      style="width: 280px; min-height: 100vh"
    >
      <!-- Sidebar links -->
      <ul class="nav nav-pills flex-column mb-auto">
        <li>
          <router-link
            to="/inventory/overview"
            class="nav-link sidebar"
            :class="{ active: $route.name === 'InventoryOverview' }"
          >
            <i class="me-2 bi bi-grid-1x2-fill"></i>
            Overview
          </router-link>
        </li>
        <li>
          <router-link
            to="/inventory/sales"
            class="nav-link sidebar"
            :class="{ active: $route.name === 'InventorySales' }"
          >
            <i class="me-2 bi bi-handbag-fill"></i>
            Sales
          </router-link>
        </li>
        <li>
          <router-link
            to="/inventory/products"
            class="nav-link sidebar"
            :class="{ active: $route.name === 'InventoryProducts' }"
          >
            <i class="me-2 bi bi-box2-fill"></i>
            Products
          </router-link>
        </li>
        <li>
          <router-link
            to="/inventory/purchase-orders"
            class="nav-link sidebar"
            :class="{ active: $route.name === 'InventoryPurchaseOrders' }"
          >
            <i class="me-2 bi bi-building-fill-down"></i>
            Purchase Orders
          </router-link>
        </li>
        <li>
          <router-link
            to="/inventory/custom-bouquets"
            class="nav-link sidebar"
            :class="{ active: $route.name === 'InventoryCustomBouquets' }"
          >
            <i class="me-2 bi bi-flower1"></i>
            Custom Bouquets
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="flex-fill p-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
aside {
  min-height: 100vh;
}

.sidebar:hover {
  box-shadow: var(--bs-box-shadow-sm);
}
</style>

<script setup>
import Products from "@/components/Inventory/Products.vue";
import Overview from "@/components/Inventory/Overview.vue";
import { ref } from "vue";
import PurchaseOrders from "@/components/Inventory/PurchaseOrders.vue";

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
      <a
        href="/"
        class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
      >
        <span class="fs-4">Inventory</span>
      </a>
      <hr />
      <ul class="nav nav-pills flex-column mb-auto">
        <li class="" @click="selectSidebar('overview')">
          <a
            href="#"
            class="nav-link sidebar"
            :class="{ active: sidebarSelected == 'overview' }"
          >
            <i
              class="me-2 bi bi-grid-1x2-fill"
              v-show="sidebarSelected == 'overview'"
            ></i>
            <i
              class="me-2 bi bi-grid-1x2"
              v-show="sidebarSelected !== 'overview'"
            ></i>
            Overview
          </a>
        </li>
        <!-- <li @click="selectSidebar('sales')">
          <a
            href="#"
            class="nav-link sidebar"
            :class="{ active: sidebarSelected == 'sales' }"
          >
            <i
              class="me-2 bi bi-handbag-fill"
              v-show="sidebarSelected == 'sales'"
            ></i>
            <i
              class="me-2 bi bi-handbag"
              v-show="sidebarSelected !== 'sales'"
            ></i>
            Sales
          </a>
        </li> -->
        <li @click="selectSidebar('products')">
          <a
            href="#"
            class="nav-link sidebar"
            :class="{ active: sidebarSelected == 'products' }"
          >
            <i
              class="me-2 bi bi-box2-fill"
              v-show="sidebarSelected == 'products'"
            ></i>
            <i
              class="me-2 bi bi-box2"
              v-show="sidebarSelected !== 'products'"
            ></i>
            Products
          </a>
        </li>
        <!-- <li @click="selectSidebar('reports')">
          <a
            href="#"
            class="nav-link sidebar"
            :class="{ active: sidebarSelected == 'reports' }"
          >
            <i
              class="me-2 bi bi-bar-chart-line-fill"
              v-show="sidebarSelected == 'reports'"
            ></i>
            <i
              class="me-2 bi bi-bar-chart-line"
              v-show="sidebarSelected !== 'reports'"
            ></i>
            Reports
          </a>
        </li> -->
        <li @click="selectSidebar('purchase')">
          <a
            href="#"
            class="nav-link sidebar"
            :class="{ active: sidebarSelected == 'purchase' }"
          >
            <i
              class="me-2 bi bi-building-fill-down"
              v-show="sidebarSelected == 'purchase'"
            ></i>
            <i
              class="me-2 bi bi-building-down"
              v-show="sidebarSelected !== 'purchase'"
            ></i>
            <!-- i should just be :class, fix later if issues arise -->
            Purchase Order
          </a>
        </li>
      </ul>
      <hr />
      <div class="dropdown">
        <a
          href="#"
          class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
          id="dropdownUser2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            width="32"
            height="32"
            class="rounded-circle me-2"
          />
          <strong>mdo</strong>
        </a>
        <ul
          class="dropdown-menu text-small shadow"
          aria-labelledby="dropdownUser2"
        >
          <li><a class="dropdown-item" href="#">New project...</a></li>
          <li><a class="dropdown-item" href="#">Settings</a></li>
          <li><a class="dropdown-item" href="#">Profile</a></li>
          <li><hr class="dropdown-divider" /></li>
          <li><a class="dropdown-item" href="#">Sign out</a></li>
        </ul>
      </div>
    </aside>

    <main class="flex-fill p-4">
      <Overview v-if="sidebarSelected == 'overview'" />
      <Products v-if="sidebarSelected == 'products'" />
      <PurchaseOrders v-if="sidebarSelected == 'purchase'" />
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

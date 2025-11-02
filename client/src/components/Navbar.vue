<script setup>
import Clock from "./POS/Clock.vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import useAuth from "@/composables/useAuth";

const route = useRoute();
const router = useRouter();
const { logout, user } = useAuth();

const isActiveLink = (routePath) => route.path === routePath;

function onLogout() {
  logout();
  router.push("/login");
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary shadow-sm">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/"
        ><img
          class="align-text-bottom"
          src="../assets/logo.jpg"
          alt="logo"
          width="30"
        />
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item me-4">
            <RouterLink
              :class="['nav-link', { active: isActiveLink('/pos') }]"
              aria-current="page"
              to="/pos"
              >POS</RouterLink
            >
          </li>
          <li class="nav-item me-4">
            <RouterLink
              :class="['nav-link', { active: isActiveLink('/transactions') }]"
              to="/transactions"
              >Transactions</RouterLink
            >
          </li>
          <li class="nav-item me-4">
            <RouterLink
              :class="['nav-link', { active: isActiveLink('/inventory') }]"
              to="/inventory"
              >Inventory</RouterLink
            >
          </li>
          <li class="nav-item dropdown me-4">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="settingsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Settings
            </a>
            <ul class="dropdown-menu" aria-labelledby="settingsDropdown">
              <li v-if="user && user.name">
                <h6 class="dropdown-header">Signed in as {{ user.name }}</h6>
              </li>
              <li v-else>
                <h6 class="dropdown-header">Not signed in</h6>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/settings">Profile / Settings</RouterLink>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <button class="dropdown-item text-danger" @click="onLogout">Logout</button>
              </li>
            </ul>
          </li>
        </ul>
        <div class="ms-auto d-flex">
          <div><Clock class="px-3" mode="date" /></div>
          <div><Clock mode="time" /></div>
        </div>
      </div>
    </div>
  </nav>
</template>

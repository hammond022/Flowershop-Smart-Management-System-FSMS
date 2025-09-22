<script setup>
import Clock from "./POS/Clock.vue";
import { RouterLink, useRoute } from "vue-router";

const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/"
        ><img
          class="align-text-bottom"
          src="../assets/icons/icon.svg"
          alt="logo"
          width="30"
          height="24"
        />FSMS</RouterLink
      >
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
          <li class="nav-item me-4">
            <RouterLink
              class="nav-link disabled"
              aria-disabled="true"
              to="/settings"
              >Settings</RouterLink
            >
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

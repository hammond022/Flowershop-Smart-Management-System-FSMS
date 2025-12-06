<template>
  <div class="container-fluid py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <!-- Header -->
        <div class="mb-4">
          <h1 class="mb-2">
            <i class="bi bi-database"></i> Database Management
          </h1>
          <p class="text-muted mb-0">
            Export and import the entire database. Admin access only.
          </p>
        </div>

        <!-- Admin Only Alert -->
        <div v-if="!isAdmin" class="alert alert-danger mb-4">
          <i class="bi bi-exclamation-circle"></i> This feature is only
          available to administrators.
        </div>

        <!-- Database Management Component -->
        <DatabaseManagement v-if="isAdmin" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { auth } from "@/auth.js";
import DatabaseManagement from "../components/UserAuth/DatabaseManagement.vue";

const isAdmin = computed(() => auth.user?.role?.admin?.isAdmin || false);
</script>

<style scoped>
h1 {
  font-weight: 600;
  color: #333;
}

p {
  font-size: 0.95rem;
}
</style>

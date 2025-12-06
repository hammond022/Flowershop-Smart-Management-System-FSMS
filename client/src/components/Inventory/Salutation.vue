<script setup>
import { computed } from "vue";
import { auth } from "@/auth";

const currentHour = new Date().getHours();

const greeting = computed(() => {
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
});

const userInitial = computed(() => {
  const name = auth.user?.username || "";
  return name.charAt(0).toUpperCase() || "?";
});
</script>

<template>
  <div class="d-flex align-items-center p-3 mb-5 bg-white rounded shadow-sm">
    <div
      class="rounded-circle bg-secondary text-primary d-flex align-items-center justify-content-center me-3"
      style="width: 75px; height: 75px"
      :class="{ 'text-success': auth.user?.role?.admin?.isAdmin }"
    >
      <strong class="fs-3">{{ userInitial }}</strong>
    </div>
    <div>
      <h3 class="mb-0">{{ greeting }}, {{ auth.user?.username }}</h3>
      <p v-if="auth.user?.role?.admin?.isAdmin" class="text-muted mb-0">
        Admin
      </p>
      <p v-else class="text-muted mb-0">Staff</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { auth } from "@/auth";

const currentHour = new Date().getHours();

const greeting = computed(() => {
  if (currentHour < 12) return "Good Morning";
  if (currentHour < 18) return "Good Afternoon";
  return "Good Evening";
});
</script>

<template>
  <div class="d-flex align-items-center p-3 mb-5 bg-white rounded shadow-sm">
    <img
      src="../../assets/icons/user.svg"
      height="75"
      width="75"
      class="rounded-circle me-3"
      alt="User Avatar"
    />
    <div>
      <h3 class="mb-0">{{ greeting }}, {{ auth.user.username }}</h3>
      <p v-if="auth.user?.role?.admin?.isAdmin" class="text-muted mb-0">
        Admin
      </p>
      <p v-else class="text-muted mb-0">Staff</p>
    </div>
  </div>
</template>

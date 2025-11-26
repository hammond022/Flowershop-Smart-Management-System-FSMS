<script setup>
import { RouterView, useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import FloralBackground from "@/components/FloralBackground.vue";

const route = useRoute();
</script>

<template>
  <FloralBackground />
  <Navbar v-if="route.name !== 'login'" />
  <div :class="route.name !== 'login' ? 'mt-4' : ''">
    <RouterView />
  </div>
  <!-- Global toast used by composable `useToast()` -->
  <div
    id="myToast"
    class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Success message</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

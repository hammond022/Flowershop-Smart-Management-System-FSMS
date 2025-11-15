<script setup>
import { RouterView, useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";

const route = useRoute();
</script>

<template>
  <Navbar v-if="route.name !== 'login'" />
  <div :class="route.name !== 'login' ? 'mt-4' : ''">
    <RouterView />
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import { auth } from "@/auth";

defineProps({
  orderStart: {
    type: String,
    default: "Pending",
  },
});

const userInitial = computed(() => {
  const name = auth.user?.username || "";
  return name.charAt(0).toUpperCase() || "?";
});
</script>

<template>
  <div class="container shadow-sm">
    <div class="inner-container">
      <div
        class="rounded-circle bg-secondary text-primary d-flex align-items-center justify-content-center my-3"
        style="width: 70px; height: 70px"
        :class="{ 'text-success': auth.user?.role?.admin?.isAdmin }"
      >
        <strong class="fs-3">{{ userInitial }}</strong>
      </div>
      <div class="text-container">
        <div v-if="auth.user?.role?.admin?.isAdmin" class="lowlight">ADMIN</div>
        <div v-else class="lowlight">STAFF</div>
        <div class="primary">{{ auth.user?.username }}</div>
      </div>
    </div>
    <div class="inner-container">
      <div>
        <div class="lowlight">ORDER START</div>
        <div v-if="orderStart">{{ orderStart.toLocaleString() }}</div>
        <div v-else>Pending Order</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  margin: 1em 0rem 1rem 0rem;
  width: 100%;
}

.inner-container {
  display: flex;
  align-items: center;
}

.text-container {
  padding: 1rem;
}
.lowlight {
  opacity: 50%;
}
.primary {
  font-size: large;
}
</style>

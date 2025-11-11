<script setup>
import { defineProps } from "vue";
import { auth } from "@/auth";

defineProps({
  orderStart: {
    type: String,
    default: "Pending",
  },
});
</script>

<template>
  <div class="container shadow-sm">
    <div class="inner-container">
      <img src="../../assets/icons/user.svg" width="70" alt="" />
      <div class="text-container">
        <div v-if="auth.user?.role?.admin?.isAdmin" class="lowlight">ADMIN</div>
        <div v-else class="lowlight">STAFF</div>
        <div class="primary">{{ auth.user.username }}</div>
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

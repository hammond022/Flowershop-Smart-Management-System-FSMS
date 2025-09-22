<script setup>
import { defineProps } from "vue";

defineProps({
  total: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="bottom-bar-container">
    <div class="bottom-bar-inner">
      <p>Total: {{ total }}</p>
      <button class="btn btn-success">Checkout</button>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar-container {
  display: flex;
  justify-content: flex-start;
  background-color: grey;
}

.bottom-bar-inner {
  display: flex;
  justify-content: space-between;
  width: 20rem;
  align-items: center;
}
</style>

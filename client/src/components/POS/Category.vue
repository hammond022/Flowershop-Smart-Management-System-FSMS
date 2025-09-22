<script setup>
import { defineProps } from "vue";

defineProps({
  category: {
    type: String,
    default: "Test",
  },
});
</script>

<template>
  <button
    type="button"
    class="btn btn-outline-secondary category"
    id="category1"
  >
    {{ category }}
  </button>
</template>

<style scoped>
.category {
  /* background-image: url(../assets/flower.jpg); */
  background-size: cover;
  height: 10rem;
  margin-bottom: 0.5rem;
  text-align: center;
  align-content: center;
  border-radius: 0.25rem;
  width: 100%;
  font-size: xx-large;
}
</style>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["search"]);
const searchQuery = ref("");

watch(searchQuery, (newValue) => {
  emit("search", newValue);
});
</script>

<template>
  <div class="mb-3 shadow-sm">
    <input
      v-model="searchQuery"
      type="text"
      class="form-control"
      placeholder="Search items..."
    />
  </div>
</template>

<style scoped></style>

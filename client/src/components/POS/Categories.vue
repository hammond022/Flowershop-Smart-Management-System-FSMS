<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: "all",
  },
});
const emit = defineEmits(["select-category"]);
</script>

<template>
  <div class="container shadow-lg">
    <h1 class="text">Categories</h1>
    <div class="category-list">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="btn category-btn w-100 mb-2 text-capitalize"
        :class="{
          'btn-primary': selectedCategory === category,
          'btn-outline-secondary': selectedCategory !== category,
        }"
        @click="emit('select-category', category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1rem;
  /* width: 40%; */
  height: 80vh;
  /* toggel this off ^ */
}

.text {
  padding: 1rem 0rem;
}

.category-list {
  overflow-y: auto;
}
</style>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";

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

const emit = defineEmits(["select-category", "toggle-custom-bouquet"]);

const isCustomBouquet = ref(false);

const displayCategories = computed(() =>
  props.categories.filter(
    (c) => (c ?? "").toString().toLowerCase().trim() !== "bouquets"
  )
);

function selectCategory(category) {
  isCustomBouquet.value = false;
  emit("select-category", category);
}

function toggleCustomBouquet() {
  isCustomBouquet.value = true;

  emit("select-category", null);
  emit("toggle-custom-bouquet", true);
}
</script>

<template>
  <div class="container shadow-lg">
    <h1 class="text">Categories</h1>
    <div class="category-list">
      <button
        v-for="category in displayCategories"
        :key="category"
        type="button"
        class="btn category-btn w-100 mb-2 text-capitalize"
        :class="{
          'btn-primary': selectedCategory === category && !isCustomBouquet,
          'btn-outline-secondary':
            selectedCategory !== category || isCustomBouquet,
        }"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
      <button
        type="button"
        class="btn category-btn w-100 mb-2 text-capitalize"
        :class="{
          'btn-primary':
            selectedCategory?.toLowerCase() === 'bouquets' && !isCustomBouquet,
          'btn-outline-secondary':
            selectedCategory?.toLowerCase() !== 'bouquets' || isCustomBouquet,
        }"
        @click="selectCategory('bouquets')"
      >
        Bouquets
      </button>

      <button
        type="button"
        class="btn category-btn w-100 mb-2 text-capitalize button-neon"
        :class="{
          'btn-success': isCustomBouquet,
          'btn-outline-secondary': !isCustomBouquet,
        }"
        @click="toggleCustomBouquet"
      >
        Custom Bouquet
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
  height: 80vh;
}

.text {
  padding: 1rem 0rem;
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
}

.category-list {
  overflow-y: auto;
}

@media (max-width: 768px) {
  .text {
    font-size: clamp(1rem, 3vw, 1.5rem);
  }
}
</style>

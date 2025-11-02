<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

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

// Track if Custom Bouquet is active
const isCustomBouquet = ref(false);

// Handle normal category click
function selectCategory(category) {
  // When user picks a category, turn off Custom Bouquet mode
  isCustomBouquet.value = false;
  emit("select-category", category);
}

// Handle Custom Bouquet click
function toggleCustomBouquet() {
  // Turn on Custom Bouquet mode
  isCustomBouquet.value = true;

  // Optionally reset selectedCategory (since we only want one highlighted)
  emit("select-category", null); // or "all", depending on your logic
  emit("toggle-custom-bouquet", true);
}
</script>

<template>
  <div class="container shadow-lg">
    <h1 class="text">Categories</h1>
    <div class="category-list">
      <!-- Normal category buttons -->
      <button
        v-for="category in categories"
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

      <!-- Custom bouquet button -->
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
  height: 90vh;
}

.text {
  padding: 1rem 0rem;
}

.category-list {
  overflow-y: auto;
}
</style>

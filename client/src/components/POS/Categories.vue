<script setup>
import Category from "./Category.vue";

const categoryArray = [
  "Flowers",
  "Bouquet",
  "Plants",
  "Others",
  "test1",
  "test2",
  "test3",
];
</script>

<template>
  <div class="container">
    <h1 class="text">Categories</h1>
    <div class="category-list">
      <Category
        v-for="category in categoryArray"
        :key="category"
        :category="category"
      />
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
  width: 40%;
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

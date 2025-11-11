<script setup>
import { defineProps } from "vue";

const props = defineProps({
  repositories: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="bg-white rounded shadow-sm p-3 mb-3">
      <h6 class="text-muted mb-2">
        <span class="badge text-bg-warning">Pending Orders</span>
      </h6>
      <ul class="list-group list-group-flush">
        <li v-for="repo in repositories" :key="repo.id" class="list-group-item">
          {{ repo.name }}
        </li>
      </ul>
    </div>

    <div class="bg-white rounded shadow-sm p-3">
      <h6 class="text-muted mb-2">Explore</h6>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">Stars</li>
        <li class="list-group-item">Organizations</li>
        <li class="list-group-item">Projects</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  cursor: pointer;
}
.list-group-item:hover {
  background-color: #f6f8fa;
}
</style>

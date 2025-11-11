<script setup>
import { defineProps } from "vue";

const props = defineProps({
  trending: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="bg-white rounded shadow-sm p-3">
    <h6 class="text-muted mb-3">Recent Purchase Orders</h6>
    <ul class="list-group list-group-flush">
      <li
        v-for="trend in trending"
        :key="trend.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        {{ trend.name }}
        <button type="button" class="btn btn-outline-primary">
          View
          <i class="bi bi-arrow-right"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

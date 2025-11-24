<template>
  <div class="card mb-3 shadow-sm">
    <div class="card-body d-flex">
      <img :src="item.avatar" class="rounded-circle me-3" width="50" />
      <div>
        <h6 class="mb-1 fw-bold">{{ item.user }}</h6>
        <p class="mb-1">{{ item.content }}</p>
        <small class="text-muted">{{ item.time }}</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

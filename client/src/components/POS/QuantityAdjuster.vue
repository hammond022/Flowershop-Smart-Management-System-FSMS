<template>
  <div class="d-flex align-items-center gap-2">
    <button
      class="btn btn-outline-primary btn-sm"
      :disabled="qty <= 1"
      @click="$emit('update', qty - 1)"
    >
      -
    </button>

    <span class="fw-bold">{{ qty }}</span>

    <button
      class="btn btn-outline-primary btn-sm"
      @click="$emit('update', qty + 1)"
    >
      +
    </button>

    <button class="btn btn-outline-danger btn-sm" @click="$emit('remove')">
      Remove
    </button>
  </div>
</template>

<script setup>
defineProps({ qty: Number });
defineEmits(["update", "remove"]);
</script>

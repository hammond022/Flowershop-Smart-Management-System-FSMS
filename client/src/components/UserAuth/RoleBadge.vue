<template>
  <span class="badge me-1" :class="badgeClass">
    {{ role }}
  </span>
</template>

<script setup>
const props = defineProps({
  role: String,
});

const badgeColors = {
  Admin: "bg-danger",
  Manager: "bg-warning text-dark",
  Editor: "bg-info text-dark",
  Viewer: "bg-secondary",
};

const badgeClass = badgeColors[props.role] || "bg-light text-dark";
</script>

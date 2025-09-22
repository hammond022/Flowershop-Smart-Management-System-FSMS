<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const props = defineProps({
  mode: { type: String, default: "time" },
});

const now = ref(new Date());
let timer;

onMounted(() => (timer = setInterval(() => (now.value = new Date()), 1000)));
onUnmounted(() => clearInterval(timer));

const displayValue = computed(() =>
  props.mode === "date"
    ? now.value.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : `${now.value.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })} ${now.value
        .toLocaleTimeString("en-US", { timeZoneName: "short" })
        .split(" ")
        .pop()}`
);
</script>

<template>
  <span>{{ displayValue }}</span>
</template>

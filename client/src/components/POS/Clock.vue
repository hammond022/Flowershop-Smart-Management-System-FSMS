<script setup>
import { useClock } from "@/composables/useClock";

const props = defineProps({
  mode: { type: String, default: "time" },
});

const { displayValue } = useClock(props.mode);
</script>

<template>
  <span>{{ displayValue }}</span>
</template>

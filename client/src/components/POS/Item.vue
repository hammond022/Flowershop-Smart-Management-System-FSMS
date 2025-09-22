<script setup>
import { defineProps } from "vue";
import { posSelected } from "@/stores/posSelected";

const props = defineProps({
  name: { type: String, default: "Transvaal daisy" },
  price: { type: Number, default: 0 },
  id: { type: Number, default: 0 },
});

function addItem() {
  posSelected.list.push(["test"]);
}
</script>

<template>
  <button
    @click="addItem"
    type="button"
    class="btn btn-outline-secondary item {"
    id="category1"
  >
    <div>{{ name }}</div>
    <div>₱{{ price }}</div>
  </button>
</template>

<style scoped>
.item {
  background-size: cover;
  margin: 0.5rem 0.5rem 0rem 0rem;
  text-align: center;
  align-content: center;
  border-radius: 0.25rem;
  height: 5rem;
  min-width: 8rem;
  font-size: large;
}
</style>

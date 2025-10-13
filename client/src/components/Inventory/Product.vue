<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: { type: String, default: "Transvaal daisy" },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  id: { type: Number, default: 0 },
  category: { type: String, default: "Roses" },
});
</script>

<template>
  <tr>
    <td scope="row">
      <input class="form-check-input" type="checkbox" value="" id="" />
    </td>
    <td scope="row">{{ name }}</td>
    <td scope="row">
      <span class="badge text-bg-secondary">{{ category }}</span>
    </td>
    <td scope="row">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum culpa
      possimus neque magni fugit.
    </td>
    <td scope="row">₱{{ price }}</td>
  </tr>
</template>

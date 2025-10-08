<script setup>
import { defineProps } from "vue";

const props = defineProps({
  name: { type: String, default: "Transvaal daisy" },
  price: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
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
    <td scope="row">{{ quantity }}</td>
    <td scope="row">₱{{ price }}</td>
    <td scope="row">
      <span class="badge text-bg-secondary">{{ category }}</span>
    </td>
    <td scope="row">
      <span class="badge rounded-pill text-bg-success">In stock</span>
    </td>
    <td scope="row">Tests</td>
    <td scope="row">
      <button type="button" class="btn btn-primary">
        <i class="bi bi-pencil-square"></i>
      </button>
      <div class="btn-group" role="group" aria-label="Basic outlined example">
        <button type="button" class="btn btn-outline-primary">
          <i class="bi bi-box-seam-fill"></i>
        </button>
        <button type="button" class="btn btn-outline-primary">-</button>
        <button type="button" class="btn btn-outline-primary">+</button>
      </div>
    </td>
  </tr>
</template>

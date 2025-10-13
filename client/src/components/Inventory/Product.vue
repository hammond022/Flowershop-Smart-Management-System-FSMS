<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  name: { type: String, default: "Transvaal daisy" },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  id: { type: Number, default: 0 },
  category: { type: String, default: "Roses" },
  description: {
    type: String,
    default:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum culpa possimus neque magni fugit.",
  },
  tags: { type: Array, default: ["tag1", "tag2", "tag3"] },
  selectedItems: { type: Array, required: true },
});

const emits = defineEmits(["update:selectedItems"]);

function toggleSelection(event) {
  const isChecked = event.target.checked;
  if (isChecked) {
    props.selectedItems.push(props.id);
  } else {
    const index = props.selectedItems.indexOf(props.id);
    if (index > -1) props.selectedItems.splice(index, 1);
  }
  emits("update:selectedItems", props.selectedItems);
}
</script>

<template>
  <tr>
    <td scope="row">
      <input
        class="form-check-input"
        type="checkbox"
        :checked="selectedItems.includes(id)"
        @change="toggleSelection"
      />
    </td>
    <td scope="row">{{ name }}</td>
    <td scope="row">
      <span class="badge text-bg-secondary">{{ category }}</span>
    </td>
    <td scope="row">
      {{ description }}
    </td>
    <td scope="row">
      <span
        class="badge rounded-pill text-bg-secondary mx-1"
        v-for="tag in tags"
        >{{ tag }}</span
      >
    </td>
    <td scope="row">₱{{ price }}</td>
  </tr>
</template>

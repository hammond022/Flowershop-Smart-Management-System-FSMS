<script setup>
import { computed, defineProps, defineEmits, ref } from "vue";
import Item from "./Item.vue";
import SearchBar from "./SearchBar.vue";

const props = defineProps({
  selectedCategory: {
    type: String,
    default: "all",
  },
  allItems: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select"]);

const searchTerm = ref("");

const filteredItems = computed(() => {
  let items = props.allItems;

  if (props.selectedCategory !== "all") {
    items = items.filter(
      (item) =>
        item.category &&
        item.category.toLowerCase() === props.selectedCategory.toLowerCase()
    );
  }
  if (searchTerm.value.trim() !== "") {
    const query = searchTerm.value.toLowerCase();
    items = items.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }

  return items;
});

function handleSelect(payload) {
  emit("select", payload);
}

function handleSearchInput(value) {
  searchTerm.value = value;
}
</script>

<template>
  <div class="container">
    <h1 class="text text-capitalize">{{ selectedCategory }} Items</h1>

    <SearchBar @search="handleSearchInput" />

    <div class="item-list">
      <Item
        v-for="flower in filteredItems"
        :key="flower.id"
        :name="flower.name"
        :price="flower.price"
        :id="flower.id"
        @select="handleSelect"
      />

      <p v-if="!filteredItems.length" class="text-center text-muted mt-3">
        No items found matching your search in this category.
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1rem 0rem;
  /* width: 40%; */
  height: 80vh;
  /* toggel this off ^ */
}

.text {
  padding: 1rem 0rem;
}

.item-list {
  overflow-y: auto;
}

.items {
  background-image: url(../assets/flower.jpg);
  background-size: cover;
  height: 10rem;
  margin: 0rem 0.5rem 0.5rem 0.5rem;
  text-align: center;
  align-content: center;
  border-radius: 0.25rem;
  width: 10rem;
  font-size: xx-large;
}
</style>

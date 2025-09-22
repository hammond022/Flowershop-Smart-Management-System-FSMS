<script setup>
import { onMounted, ref, reactive } from "vue";
import Item from "./Item.vue";
import SearchBar from "./SearchBar.vue";
import ItemService from "@/router/api/itemsService";

const flowers = reactive({
  items: {},
  isLoading: true,
});

onMounted(async () => {
  try {
    flowers.items = await ItemService.getItems();
  } catch (err) {
    err.value = err.message || "Failed to load items";
    console.error(err);
  } finally {
    flowers.isLoading = false;
  }
});
</script>

<template>
  <div class="container">
    <h1 class="text">Flowers</h1>
    <SearchBar />
    <div class="item-list">
      <Item
        v-for="flower in flowers.items"
        :key="flower.name"
        :name="flower.name"
        :price="flower.price"
        :id="flower.id"
      />
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
  width: 40%;
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

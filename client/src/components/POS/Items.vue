<script setup>
import { computed, defineProps, defineEmits, ref, onMounted, watch } from "vue";
import Item from "./Item.vue";
import SearchBar from "./SearchBar.vue";
import CustomBouquetService from "@/router/api/CustomBouquetService";

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

const emit = defineEmits(["select", "add-bouquet"]);

const searchTerm = ref("");

const isBouquetsMode = computed(
  () => props.selectedCategory?.toLowerCase() === "bouquets"
);
const bouquets = ref([]);
const loadingBouquets = ref(false);
const bouquetError = ref("");

async function fetchBouquets() {
  try {
    loadingBouquets.value = true;
    bouquetError.value = "";
    const res = await CustomBouquetService.getCustomBouquets();
    bouquets.value = Array.isArray(res) ? res : [];
  } catch (e) {
    bouquetError.value = "Failed to load bouquets";
    bouquets.value = [];
  } finally {
    loadingBouquets.value = false;
  }
}

onMounted(() => {
  if (isBouquetsMode.value) fetchBouquets();
});

watch(
  () => props.selectedCategory,
  (val, oldVal) => {
    if (
      val?.toLowerCase() === "bouquets" &&
      oldVal?.toLowerCase() !== "bouquets"
    ) {
      fetchBouquets();
    }
  }
);

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

function handleBouquetClick(bouquet) {
  const components = (bouquet.items || []).map((it) => ({
    itemId: it.itemId,
    itemName: it.itemName,
    quantity: it.quantity || 1,
  }));

  const payload = {
    id: `bouquet:${bouquet.id}`,
    type: "bouquet",
    name: bouquet.name || "Bouquet",
    price: typeof bouquet.price === "number" ? bouquet.price : 0,
    qty: 1,
    components,
  };

  emit("add-bouquet", payload);
}
</script>

<template>
  <div class="container shadow-lg">
    <h1 class="text text-capitalize">
      {{ isBouquetsMode ? "Bouquets" : `${selectedCategory} Items` }}
    </h1>

    <SearchBar @search="handleSearchInput" />

    <div class="item-list">
      <template v-if="isBouquetsMode">
        <div v-if="loadingBouquets" class="text-center text-muted mt-3">
          Loading bouquets...
        </div>
        <div v-else>
          <div
            v-for="b in bouquets.filter((b) => {
              if (!searchTerm || !searchTerm.trim()) return true;
              const q = searchTerm.toLowerCase();
              return (
                b.name?.toLowerCase().includes(q) ||
                b.description?.toLowerCase().includes(q)
              );
            })"
            :key="b.id"
            class="card bouquet-card mb-2 w-100"
          >
            <div
              class="card-header d-flex align-items-center justify-content-between"
            >
              <div class="d-flex align-items-center gap-3 flex-grow-1">
                <div
                  class="image-container image-placeholder"
                  aria-hidden="true"
                >
                  💐
                </div>
                <div class="item-details">
                  <div class="item-name mb-1">{{ b.name }}</div>
                  <div class="item-price">₱{{ b.price }}</div>
                </div>
              </div>
              <div class="btn-group ms-3">
                <button
                  class="btn btn-primary btn-sm"
                  @click="handleBouquetClick(b)"
                >
                  Add
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="`#bouquet-items-${b.id}`"
                  aria-expanded="false"
                  :aria-controls="`bouquet-items-${b.id}`"
                  @click.stop
                >
                  <i class="bi bi-chevron-down"></i>
                </button>
              </div>
            </div>
            <div :id="`bouquet-items-${b.id}`" class="collapse">
              <ul class="list-group list-group-flush">
                <li
                  v-for="(it, idx) in b.items || []"
                  :key="`${b.id}-${idx}`"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span class="text-truncate">{{
                    it.itemName || `Item ${it.itemId}`
                  }}</span>
                  <span class="badge text-bg-secondary"
                    >x{{ it.quantity || 1 }}</span
                  >
                </li>
                <li
                  v-if="!(b.items && b.items.length)"
                  class="list-group-item text-muted"
                >
                  No items in this bouquet
                </li>
              </ul>
            </div>
          </div>
          <p
            v-if="!bouquets.length && !loadingBouquets"
            class="text-center text-muted mt-3"
          >
            No bouquets available.
          </p>
          <p v-if="bouquetError" class="text-center text-danger mt-2">
            {{ bouquetError }}
          </p>
        </div>
      </template>

      <template v-else>
        <Item
          v-for="flower in filteredItems"
          :key="flower.id"
          :name="flower.name"
          :price="flower.price"
          :id="flower.id"
          :stock="flower.stock"
          :photo="flower.photo"
          @select="handleSelect"
        />

        <p v-if="!filteredItems.length" class="text-center text-muted mt-3">
          No items found matching your search in this category.
        </p>
      </template>
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
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
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

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 28px;
}

.bouquet-card .image-container {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}

.bouquet-card .item-details {
  text-align: left;
}
</style>

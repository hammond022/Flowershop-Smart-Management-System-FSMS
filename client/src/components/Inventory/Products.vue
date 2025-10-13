<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { Modal, Toast } from "bootstrap";
import ItemService from "@/router/api/itemsService";
import InventoryProduct from "./Product.vue";

const flowers = reactive({
  items: [],
  isLoading: true,
});

const categories = ref([]);
const selectedCategory = ref("all");

const getFlowers = async () => {
  try {
    flowers.items = await ItemService.getItems();

    const uniqueCategories = [
      ...new Set(flowers.items.map((item) => item.category)),
    ];
    categories.value = uniqueCategories;
  } catch (err) {
    console.error(err.message || "Failed to load items");
  } finally {
    flowers.isLoading = false;
  }
};

const filteredItems = computed(() => {
  if (selectedCategory.value === "all") return flowers.items;
  return flowers.items.filter(
    (item) => item.category === selectedCategory.value
  );
});

const product = reactive({
  name: "",
  price: 0,
  quantity: 1,
  tags: ["Birthday", "Happy"],
  category: "",
});

async function submitProduct() {
  try {
    await ItemService.createItem({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      tags: product.tags,
    });
    toastInstance.show();
    createProductModal.hide();
    getFlowers();
  } catch (err) {
    console.error("Create failed:", err.response?.data || err.message);
  }
}

function resetModal() {
  product.name = "";
  product.price = 0;
  product.category = "";
}

function increasePrice(amount = 10) {
  const current = Number(product.price) || 0;
  product.price = current + amount;
}
function decreasePrice(amount = 1) {
  if (product.price - amount >= 0) product.price -= amount;
}

async function submitProduct() {
  try {
    await ItemService.createItem({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      tags: product.tags,
    });
    toastInstance.show();
    createProductModal.hide();
    getFlowers();
  } catch (err) {
    console.error("Create failed:", err.response?.data || err.message);
  }
}

let toastInstance;
let createProductModal;

function createProduct() {
  resetModal();
  createProductModal.show();
}

onMounted(() => {
  createProductModal = new Modal(document.getElementById("createProductModal"));
  toastInstance = new Toast(document.getElementById("myToast"), {
    delay: 3000,
    autohide: true,
  });
  getFlowers();
});
</script>

<template>
  <main class="p-4">
    <div class="d-flex justify-content-between">
      <h1>Products</h1>

      <div class="btn-group mb-4">
        <button type="button" class="btn btn-primary">Create Product</button>
        <button
          @click="createProduct"
          type="button"
          class="btn btn-outline-primary"
        >
          <i class="bi bi-pencil-square"></i>
        </button>
      </div>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          All
        </button>
      </li>
      <li v-for="category in categories" :key="category" class="nav-item">
        <button
          class="nav-link text-capitalize"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </li>
    </ul>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Category</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        <InventoryProduct
          v-for="flower in filteredItems"
          :key="flower.id"
          :name="flower.name"
          :quantity="flower.quantity"
          :price="flower.price"
          :category="flower.category"
        />
      </tbody>
    </table>

    <!-- Toast -->
    <div
      id="myToast"
      class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">
          Successfully created product {{ product.name }}
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="createProductModal"
      tabindex="-1"
      aria-labelledby="createProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createProductModalLabel">
              Quick Create
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="input-group mb-3">
              <span class="input-group-text">Name</span>
              <input
                type="text"
                class="form-control"
                placeholder="ex. Transvaal daisy"
                v-model="product.name"
              />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">Price</span>
              <span class="input-group-text">₱</span>
              <input
                type="text"
                class="form-control"
                v-model.number="product.price"
              />
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="decreasePrice()"
              >
                -
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="increasePrice()"
              >
                +
              </button>
            </div>

            <div class="mb-3 input-group">
              <span class="input-group-text">Category</span>
              <select class="form-select" v-model="product.category">
                <option value="" disabled>Select category</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <div class="input-group">
                <span class="input-group-text">Tags</span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="ex. Birthday, Happy"
                  disabled
                />
              </div>
              <div class="form-text">Separate tags by space or comma.</div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="submitProduct"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

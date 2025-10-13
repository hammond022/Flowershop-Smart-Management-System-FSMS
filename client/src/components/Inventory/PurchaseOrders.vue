<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { Modal, Toast } from "bootstrap";
import { useToast } from "@/composables/useToast";
import ItemService from "@/router/api/itemsService.js"; // same service for items

const { showToast } = useToast();

const purchaseOrders = reactive({
  items: [],
  isLoading: true,
});

const categories = ref([]);
const selectedCategory = ref("all");

const getItems = async () => {
  try {
    purchaseOrders.items = await ItemService.getItems();
    const uniqueCategories = [
      ...new Set(purchaseOrders.items.map((item) => item.category)),
    ];
    categories.value = uniqueCategories;
  } catch (err) {
    console.error("Error loading items:", err);
  } finally {
    purchaseOrders.isLoading = false;
  }
};

const filteredItems = computed(() => {
  if (selectedCategory.value === "all") return purchaseOrders.items;
  return purchaseOrders.items.filter(
    (item) => item.category === selectedCategory.value
  );
});

const purchaseForm = reactive({
  productId: null,
  name: "",
  currentStock: 0,
  quantity: 0,
  supplier: "",
  costPerUnit: 0,
});

let createPOModal;

function openPurchaseModal(item) {
  purchaseForm.productId = item.id;
  purchaseForm.name = item.name;
  purchaseForm.currentStock = item.stock;
  purchaseForm.quantity = 0;
  purchaseForm.supplier = "";
  purchaseForm.costPerUnit = item.cost || 0;

  createPOModal.show();
}

async function submitPurchaseOrder() {
  if (!purchaseForm.productId || purchaseForm.quantity <= 0) {
    showToast("error", "Please enter a valid quantity.");
    return;
  }

  try {
    const newStock = purchaseForm.currentStock + purchaseForm.quantity;

    await ItemService.updateItemStock(purchaseForm.productId, newStock);

    showToast(
      "success",
      `Purchase order complete! ${purchaseForm.name} stock increased to ${newStock}.`
    );

    getItems();
  } catch (err) {
    console.error("Failed to submit purchase order:", err);
    showToast("error", err.response?.data?.error || "Failed to create PO");
  } finally {
    createPOModal.hide();
  }
}

onMounted(() => {
  getItems();
  createPOModal = new Modal(document.getElementById("createPOModal"));
});
</script>

<template>
  <main class="p-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Purchase Orders</h1>
      <div class="btn-group mb-4">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="getItems"
        >
          Refresh
          <i class="bi bi-arrow-clockwise ms-1"></i>
        </button>
      </div>
    </div>

    <!-- Category filter -->
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
          <th>Category</th>
          <th>Stock</th>
          <th>Cost</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>
            <span class="badge text-bg-secondary">{{ item.category }}</span>
          </td>
          <td>
            <span
              :class="{
                'text-success': item.stock > 10,
                'text-warning': item.stock <= 10 && item.stock > 0,
                'text-danger': item.stock === 0,
              }"
            >
              {{ item.stock }}
            </span>
          </td>
          <td>₱{{ item.cost }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              @click="openPurchaseModal(item)"
            >
              Create PO
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Purchase Order Modal -->
    <div
      class="modal fade"
      id="createPOModal"
      tabindex="-1"
      aria-labelledby="createPOModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createPOModalLabel">
              Create Purchase Order
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Product</label>
              <input
                type="text"
                class="form-control"
                v-model="purchaseForm.name"
                disabled
              />
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Current Stock</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="purchaseForm.currentStock"
                  disabled
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Quantity to Add</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="purchaseForm.quantity"
                  min="1"
                />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Supplier</label>
              <input
                type="text"
                class="form-control"
                v-model="purchaseForm.supplier"
                placeholder="Supplier name"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Cost per Unit (₱)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="purchaseForm.costPerUnit"
                min="0"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitPurchaseOrder"
            >
              Submit Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Toast -->
  <div
    id="myToast"
    class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Success message</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

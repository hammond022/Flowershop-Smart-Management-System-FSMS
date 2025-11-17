<template>
  <div
    class="modal fade"
    id="createEditBouquetModal"
    tabindex="-1"
    aria-labelledby="createEditBouquetModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createEditBouquetModalLabel">
            {{ isEditing ? "Edit Bouquet" : "Create Custom Bouquet" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="closeBouquetModal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body">
          <!-- Bouquet Name -->
          <div class="mb-3">
            <label for="bouquetName" class="form-label">Bouquet Name</label>
            <input
              v-model="form.name"
              type="text"
              class="form-control"
              id="bouquetName"
              placeholder="e.g., Spring Romance"
              @blur="validateForm"
            />
            <small v-if="errors.name" class="text-danger">
              {{ errors.name }}
            </small>
          </div>

          <!-- Description -->
          <div class="mb-3">
            <label for="bouquetDescription" class="form-label">
              Description (Optional)
            </label>
            <textarea
              v-model="form.description"
              class="form-control"
              id="bouquetDescription"
              rows="2"
              placeholder="Describe this bouquet"
            ></textarea>
          </div>

          <!-- Price -->
          <div class="mb-3">
            <label for="bouquetPrice" class="form-label">Price ($)</label>
            <input
              v-model.number="form.price"
              type="number"
              class="form-control"
              id="bouquetPrice"
              placeholder="0.00"
              step="0.01"
              min="0"
              @blur="validateForm"
            />
            <small v-if="errors.price" class="text-danger">
              {{ errors.price }}
            </small>
          </div>

          <!-- Items Selection -->
          <div class="mb-3">
            <label class="form-label">Select Items</label>
            <div class="mb-2">
              <input
                v-model="itemSearchTerm"
                type="text"
                class="form-control"
                placeholder="Search items..."
              />
            </div>

            <div class="list-group" style="max-height: 300px; overflow-y: auto">
              <button
                v-for="item in filteredAvailableItems"
                :key="item.id"
                type="button"
                class="list-group-item list-group-item-action text-start"
                @click="addItemToSelection(item)"
              >
                <div class="d-flex justify-content-between">
                  <span
                    ><strong>{{ item.name }}</strong></span
                  >
                  <span class="text-muted">${{ item.price.toFixed(2) }}</span>
                </div>
                <small class="text-muted">Category: {{ item.category }}</small>
              </button>

              <div
                v-if="filteredAvailableItems.length === 0"
                class="p-3 text-muted text-center"
              >
                No items found
              </div>
            </div>

            <small v-if="errors.items" class="text-danger">
              {{ errors.items }}
            </small>
          </div>

          <!-- Selected Items List -->
          <div class="mb-3">
            <label class="form-label"
              >Selected Items ({{ form.items.length }})</label
            >
            <div class="list-group">
              <div
                v-for="(selectedItem, index) in form.items"
                :key="`${selectedItem.itemId}-${index}`"
                class="list-group-item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <div>
                      <strong>{{ selectedItem.itemName }}</strong>
                    </div>
                    <small class="text-muted"
                      >ID: {{ selectedItem.itemId }}</small
                    >
                  </div>

                  <div class="d-flex align-items-center gap-2">
                    <div
                      class="input-group input-group-sm"
                      style="width: 120px"
                    >
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="decreaseQuantity(index)"
                      >
                        −
                      </button>
                      <input
                        v-model.number="selectedItem.quantity"
                        type="number"
                        class="form-control text-center"
                        min="1"
                        @change="validateQuantity(index)"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-secondary"
                        @click="increaseQuantity(index)"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      class="btn btn-sm btn-danger"
                      @click="removeItemFromSelection(index)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div
                v-if="form.items.length === 0"
                class="list-group-item text-muted text-center"
              >
                No items selected
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeBouquetModal"
          >
            Cancel
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitBouquet"
            :disabled="isSubmitting"
          >
            <span
              v-if="isSubmitting"
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            {{ isEditing ? "Update Bouquet" : "Create Bouquet" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from "vue";
import { Modal } from "bootstrap";
import ItemService from "@/router/api/itemsService.js";
import CustomBouquetService from "@/router/api/CustomBouquetService.js";
import { useToast } from "@/composables/useToast.js";

const { showToast } = useToast();

const emit = defineEmits(["bouquet-created", "bouquet-updated"]);

const props = defineProps({
  editingBouquet: {
    type: Object,
    default: null,
  },
});

const isEditing = computed(() => !!props.editingBouquet);

const form = ref({
  name: "",
  description: "",
  price: 0,
  items: [],
});

const errors = ref({
  name: "",
  price: "",
  items: "",
});

const availableItems = ref([]);
const itemSearchTerm = ref("");
const isSubmitting = ref(false);
let bouquetModal = null;

const filteredAvailableItems = computed(() => {
  if (!itemSearchTerm.value.trim()) {
    return availableItems.value;
  }

  const term = itemSearchTerm.value.toLowerCase();
  return availableItems.value.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
  );
});

// Initialize modal
async function initializeModal() {
  const modalEl = document.getElementById("createEditBouquetModal");
  bouquetModal = new Modal(modalEl);

  // Load available items
  await loadAvailableItems();

  // If editing, populate form with existing data
  if (isEditing.value) {
    form.value = {
      name: props.editingBouquet.name,
      description: props.editingBouquet.description || "",
      price: props.editingBouquet.price,
      items: JSON.parse(JSON.stringify(props.editingBouquet.items)),
    };
  } else {
    resetForm();
  }

  bouquetModal.show();
}

async function loadAvailableItems() {
  try {
    availableItems.value = await ItemService.getItems();
  } catch (err) {
    console.error("Failed to load items:", err);
    showToast("error", "Failed to load items");
  }
}

function addItemToSelection(item) {
  const existingItem = form.value.items.find((i) => i.itemId === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    form.value.items.push({
      itemId: item.id,
      itemName: item.name,
      quantity: 1,
    });
  }

  itemSearchTerm.value = "";
  validateForm();
}

function removeItemFromSelection(index) {
  form.value.items.splice(index, 1);
  validateForm();
}

function increaseQuantity(index) {
  if (form.value.items[index]) {
    form.value.items[index].quantity += 1;
  }
}

function decreaseQuantity(index) {
  if (form.value.items[index] && form.value.items[index].quantity > 1) {
    form.value.items[index].quantity -= 1;
  }
}

function validateQuantity(index) {
  if (form.value.items[index]) {
    const qty = form.value.items[index].quantity;
    if (!qty || qty < 1) {
      form.value.items[index].quantity = 1;
    }
  }
}

function validateForm() {
  errors.value = {
    name: "",
    price: "",
    items: "",
  };

  if (!form.value.name.trim()) {
    errors.value.name = "Bouquet name is required";
  }

  if (typeof form.value.price !== "number" || form.value.price < 0) {
    errors.value.price = "Valid price is required";
  }

  if (form.value.items.length === 0) {
    errors.value.items = "At least one item must be selected";
  }

  return Object.values(errors.value).every((err) => err === "");
}

async function submitBouquet() {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const bouquetData = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      items: form.value.items,
    };

    if (isEditing.value) {
      await CustomBouquetService.updateCustomBouquet(
        props.editingBouquet.id,
        bouquetData
      );
      showToast("success", `Bouquet "${form.value.name}" updated successfully`);
      emit("bouquet-updated");
    } else {
      await CustomBouquetService.createCustomBouquet(bouquetData);
      showToast("success", `Bouquet "${form.value.name}" created successfully`);
      emit("bouquet-created");
    }

    closeBouquetModal();
  } catch (err) {
    console.error("Failed to save bouquet:", err);
    showToast("error", err.response?.data?.error || "Failed to save bouquet");
  } finally {
    isSubmitting.value = false;
  }
}

function resetForm() {
  form.value = {
    name: "",
    description: "",
    price: 0,
    items: [],
  };
  errors.value = {
    name: "",
    price: "",
    items: "",
  };
  itemSearchTerm.value = "";
}

function closeBouquetModal() {
  if (bouquetModal) {
    bouquetModal.hide();
  }
  resetForm();
}

defineExpose({
  initializeModal,
  closeBouquetModal,
});
</script>

<style scoped>
.list-group-item-action:hover {
  background-color: #f8f9fa;
}

.input-group-sm .form-control,
.input-group-sm .btn {
  font-size: 0.875rem;
}
</style>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Custom Bouquets</h2>
      <button
        type="button"
        class="btn btn-primary"
        @click="openCreateBouquetModal"
      >
        <i class="bi bi-plus-lg me-2"></i> Create Custom Bouquet
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="customBouquets.length === 0" class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>
      No custom bouquets yet. Create one to get started!
    </div>

    <!-- Bouquets Grid -->
    <div v-else class="row">
      <div
        v-for="bouquet in customBouquets"
        :key="bouquet.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ bouquet.name }}</h5>
            <p v-if="bouquet.description" class="card-text text-muted small">
              {{ bouquet.description }}
            </p>

            <!-- Items List -->
            <div class="mb-3">
              <small class="text-muted d-block mb-2">
                <strong>Items ({{ bouquet.items.length }}):</strong>
              </small>
              <ul class="list-unstyled ms-2">
                <li
                  v-for="(item, idx) in bouquet.items"
                  :key="idx"
                  class="small"
                >
                  {{ item.quantity }}x {{ item.itemName }}
                </li>
              </ul>
            </div>

            <!-- Price -->
            <div class="mb-3 pt-2 border-top">
              <div class="d-flex justify-content-between align-items-center">
                <strong>Price:</strong>
                <span class="h5 text-success mb-0"
                  >${{ bouquet.price.toFixed(2) }}</span
                >
              </div>
            </div>

            <!-- Timestamps -->
            <div class="mb-3">
              <small class="text-muted d-block">
                Created: {{ formatDate(bouquet.createdAt) }}
              </small>
              <small
                v-if="
                  bouquet.updatedAt && bouquet.updatedAt !== bouquet.createdAt
                "
                class="text-muted d-block"
              >
                Updated: {{ formatDate(bouquet.updatedAt) }}
              </small>
            </div>
          </div>

          <!-- Actions -->
          <div class="card-footer bg-white d-flex gap-2">
            <button
              type="button"
              class="btn btn-sm btn-warning flex-grow-1"
              @click="openEditBouquetModal(bouquet)"
            >
              <i class="bi bi-pencil me-1"></i> Edit
            </button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              @click="deleteBouquet(bouquet.id, bouquet.name)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <CreateEditBouquetModal
      ref="bouquetModalRef"
      :editing-bouquet="editingBouquet"
      @bouquet-created="loadBouquets"
      @bouquet-updated="loadBouquets"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CreateEditBouquetModal from "./CreateEditBouquetModal.vue";
import CustomBouquetService from "@/router/api/CustomBouquetService.js";
import { useToast } from "@/composables/useToast.js";

const { showToast } = useToast();

const customBouquets = ref([]);
const isLoading = ref(true);
const editingBouquet = ref(null);
const bouquetModalRef = ref(null);

// Load all custom bouquets
async function loadBouquets() {
  try {
    isLoading.value = true;
    customBouquets.value = await CustomBouquetService.getCustomBouquets();
  } catch (err) {
    console.error("Failed to load custom bouquets:", err);
    showToast("error", "Failed to load custom bouquets");
  } finally {
    isLoading.value = false;
  }
}

// Open modal for creating a new bouquet
function openCreateBouquetModal() {
  editingBouquet.value = null;
  bouquetModalRef.value.initializeModal();
}

// Open modal for editing an existing bouquet
function openEditBouquetModal(bouquet) {
  editingBouquet.value = bouquet;
  bouquetModalRef.value.initializeModal();
}

// Delete a bouquet
async function deleteBouquet(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    await CustomBouquetService.deleteCustomBouquet(id);
    showToast("success", `Bouquet "${name}" deleted successfully`);
    await loadBouquets();
  } catch (err) {
    console.error("Failed to delete bouquet:", err);
    showToast("error", "Failed to delete bouquet");
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Load bouquets on component mount
onMounted(() => {
  loadBouquets();
});
</script>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.btn-sm {
  font-size: 0.875rem;
}
</style>

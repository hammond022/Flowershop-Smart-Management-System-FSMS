<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { Modal, Toast } from "bootstrap";
import { useToast } from "@/composables/useToast";
import ItemService from "@/router/api/itemsService.js";
import InventoryProduct from "./Product.vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { resolveBackendOrigin } from "@/api/base.js";

const route = useRoute();
const { user } = useAuth();

const { showToast } = useToast();

const flowers = reactive({
  items: [],
  isLoading: true,
});

const selectedItems = ref([]);
const isDeleting = ref(false);

const categories = ref([]);
const selectedCategory = ref("all");
const newCategory = ref(false);
const searchQuery = ref("");

function formSetNewcategory(x) {
  newCategory.value = x;
}

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

// Prefer backend-provided error messages, with sensible fallbacks
function getErrorMessage(err) {
  const data = err?.response?.data;
  return (
    data?.error ||
    data?.message ||
    (typeof data === "string" ? data : null) ||
    err?.message ||
    "An unexpected error occurred"
  );
}

const filteredItems = computed(() => {
  const categoryFiltered =
    selectedCategory.value === "all"
      ? flowers.items
      : flowers.items.filter(
          (item) => item.category === selectedCategory.value
        );

  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return categoryFiltered;

  return categoryFiltered.filter((item) => {
    const name = (item.name || "").toLowerCase();
    const description = (item.description || "").toLowerCase();
    const tags = Array.isArray(item.tags)
      ? item.tags.join(", ").toLowerCase()
      : (item.tags || "").toLowerCase();
    return (
      name.includes(query) ||
      description.includes(query) ||
      tags.includes(query) ||
      (item.category || "").toLowerCase().includes(query)
    );
  });
});

const allSelected = computed(
  () =>
    filteredItems.value.length > 0 &&
    filteredItems.value.every((item) => selectedItems.value.includes(item.id))
);

const isIndeterminate = computed(
  () =>
    selectedItems.value.length > 0 &&
    !allSelected.value &&
    filteredItems.value.length > 0
);

const toggleSelectAll = (event) => {
  const shouldSelectAll = event.target.checked;
  selectedItems.value = shouldSelectAll
    ? filteredItems.value.map((item) => item.id)
    : [];
};

const product = reactive({
  id: null,
  name: "",
  price: 0,
  cost: 0,
  category: "",
  description: "",
  tags: "",
  photo: null,
  previewUrl: null, // for image preview
});

const isEditMode = ref(false);

async function submitProduct() {
  try {
    if (isEditMode.value && product.id) {
      // Update existing product
      await ItemService.updateItem(product.id, {
        name: product.name,
        price: product.price,
        cost: product.cost,
        category: product.category,
        description: product.description,
        tags: product.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        photo: product.photo,
        previewUrl: product.previewUrl,
      });
      showToast("success", `Product ${product.name} updated successfully`);
    } else {
      // Create new product
      await ItemService.createItem({
        name: product.name,
        price: product.price,
        cost: product.cost,
        category: product.category,
        description: product.description,
        tags: product.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        stock: 0,
        photo: product.photo,
        previewUrl: product.previewUrl,
      });
      showToast("success", `Successfully created product ${product.name}`);
    }
    resetModal();
  } catch (err) {
    console.error("Save failed:", err.response?.data || err.message);
    showToast("error", getErrorMessage(err));
  } finally {
    createProductModal.hide();
    getFlowers();
  }
}

async function deleteSelectedItems() {
  if (
    !confirm(
      `Are you sure you want to delete ${selectedItems.value.length} item(s)?`
    )
  )
    return;

  try {
    isDeleting.value = true;
    for (const id of [...selectedItems.value]) {
      await ItemService.deleteItem(id);
    }
    showToast(
      "success",
      `${selectedItems.value.length} item(s) deleted successfully`
    );
    selectedItems.value = [];
    getFlowers();
  } catch (err) {
    console.error("Delete failed:", err.response?.data || err.message);
    showToast(
      "error",
      getErrorMessage(err) || "Failed to delete selected items"
    );
  } finally {
    isDeleting.value = false;
  }
}

function resetModal() {
  product.id = null;
  product.name = "";
  product.price = 0;
  product.cost = 0;
  product.category = "";
  product.description = "";
  product.tags = "";
  product.photo = null;
  product.previewUrl = null;
  isEditMode.value = false;
}

function increasePrice(amount = 10) {
  const current = Number(product.price) || 0;
  product.price = current + amount;
}
function decreasePrice(amount = 1) {
  if (product.price - amount >= 0) product.price -= amount;
}

let toastInstance;
let createProductModal;

function createProduct() {
  resetModal();
  isEditMode.value = false;
  createProductModal.show();
}

function editProduct(productId) {
  const item = flowers.items.find((f) => f.id === productId);
  if (item) {
    product.id = item.id;
    product.name = item.name;
    product.price = item.price;
    product.cost = item.cost;
    product.category = item.category;
    product.description = item.description;
    product.tags = Array.isArray(item.tags) ? item.tags.join(", ") : item.tags;
    product.photo = item.photo || null;
    product.previewUrl = item.photo || null;
    isEditMode.value = true;
    createProductModal.show();
  }
}

const isUploading = ref(false);

const backendOrigin = resolveBackendOrigin();

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Instant local preview
  product.previewUrl = URL.createObjectURL(file);
  isUploading.value = true;

  try {
    const res = await ItemService.uploadPhoto(file);
    // Adjust this depending on your backend response structure
    // e.g. if backend sends { filePath: "uploads/filename.jpg" }
    product.photo = res.fileUrl || `${backendOrigin}${res.filePath}`;

    showToast("success", "Photo uploaded successfully!");
  } catch (err) {
    console.error("Photo upload failed:", err);
    showToast("error", getErrorMessage(err) || "Photo upload failed");
    product.photo = null;
  } finally {
    isUploading.value = false;
  }
};

watch(
  () => route.query.category,
  (newCategory) => {
    if (newCategory) selectedCategory.value = newCategory;
  }
);

onMounted(() => {
  createProductModal = new Modal(document.getElementById("createProductModal"));
  toastInstance = new Toast(document.getElementById("myToast"), {
    delay: 3000,
    autohide: true,
  });

  getFlowers();

  if (route.query.category) {
    selectedCategory.value = route.query.category;
  }
});

const canCreate = computed(() => {
  const perms = user.value?.permissions;
  // Disable only when explicitly set to false
  const flag = perms?.items?.canCreate;
  if (flag === false) return false;
  return true;
});
</script>

<template>
  <main class="p-4">
    <div
      class="d-flex justify-content-between flex-wrap gap-3 align-items-start mb-3"
    >
      <div>
        <h1 class="mb-3">Products</h1>
        <div class="input-group">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input
            v-model="searchQuery"
            type="search"
            class="form-control"
            placeholder="Search by name, description, tags, or category"
          />
        </div>
      </div>

      <div class="btn-group mb-4">
        <!-- <button type="button" class="btn btn-primary">Create Product</button> -->
        <button
          @click="createProduct"
          type="button"
          class="btn btn-primary"
          :disabled="!canCreate"
          :title="
            !canCreate ? 'You do not have permission to create products' : ''
          "
        >
          Create Product
          <i class="bi bi-plus-circle ms-1"></i>
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="selectedItems.length === 0 || isDeleting"
          @click="deleteSelectedItems"
        >
          <span v-if="isDeleting">
            <i class="bi bi-hourglass-split"></i>
          </span>
          <span v-else>
            <i class="bi bi-trash"></i>
          </span>
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
          <th>
            <input
              class="form-check-input"
              type="checkbox"
              :checked="allSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
            />
          </th>
          <th>Name</th>
          <th>Category</th>
          <th>Description</th>
          <th>Tags</th>
          <th>Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <InventoryProduct
          v-for="flower in filteredItems"
          :key="flower.id"
          :id="flower.id"
          :name="flower.name"
          :stock="flower.stock"
          :price="flower.price"
          :description="flower.description"
          :category="flower.category"
          :tags="flower.tags"
          :selectedItems="selectedItems"
          @update:selectedItems="selectedItems = $event"
          @editProduct="editProduct"
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
  </main>
  <!-- Modal -->
  <div
    class="modal fade"
    id="screateProductModal"
    tabindex="-1"
    aria-labelledby="createProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="createProductModalLabel">Quick Create</h5>
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
          <button type="button" class="btn btn-primary" @click="submitProduct">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="createProductModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="productModalLabel">Edit Product</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form>
          <div class="modal-body">
            <!-- Preview Card -->
            <div class="card mb-4">
              <div class="row g-0">
                <div
                  class="col-md-4 d-flex align-items-center justify-content-center"
                >
                  <img
                    :src="
                      product.previewUrl ||
                      'https://placehold.co/400x400?text=No+Image'
                    "
                    class="img-fluid rounded"
                    style="width: 150px; height: 150px; object-fit: cover"
                    alt="Product preview"
                  />
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h5 class="card-title">
                      {{ product.name || "Product Name" }}
                    </h5>
                    <p class="card-text">
                      {{ product.description || "No description available" }}
                    </p>
                    <div class="mb-2">
                      <span class="badge bg-primary me-1">{{
                        product.category || "Category"
                      }}</span>
                      <span
                        v-for="tag in product.tags
                          ? product.tags.split(',')
                          : []"
                        :key="tag"
                        class="badge bg-secondary me-1"
                      >
                        {{ tag.trim() }}
                      </span>
                    </div>
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <p class="mb-0">
                          <strong>Selling Price:</strong> ₱{{
                            product.price || 0
                          }}
                        </p>
                        <p class="mb-0">
                          <strong>Cost Price:</strong> ₱{{ product.cost || 0 }}
                        </p>
                      </div>
                      <div class="text-end">
                        <p
                          class="mb-0 text-success"
                          v-if="product.price && product.cost"
                        >
                          Profit: ₱{{ product.price - product.cost }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Existing form fields -->
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="photo" class="form-label">Product Photo</label>
                <input
                  class="form-control"
                  type="file"
                  id="photo"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  :disabled="isUploading"
                />
                <div v-if="isUploading" class="form-text text-primary">
                  <i class="bi bi-arrow-repeat"></i> Uploading image…
                </div>
              </div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    type="text"
                    class="form-control"
                    id="productName"
                    placeholder="Product Name"
                    required
                    v-model="product.name"
                  />
                  <label for="productName">Product Name</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    type="text"
                    class="form-control"
                    id="tags"
                    placeholder="Comma-separated tags"
                    v-model="product.tags"
                  />
                  <label for="tags">Tags (comma-separated)</label>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="form-floating mb-3">
              <textarea
                class="form-control"
                placeholder="Description"
                id="description"
                style="height: 120px"
                required
                v-model="product.description"
              ></textarea>
              <label for="description">Description</label>
            </div>
            <!-- image -->

            <!-- category 1 -->
            <div v-if="!newCategory" class="mb-3 input-group">
              <span class="input-group-text">Category</span>
              <select class="form-select" v-model="product.category" required>
                <option value="" disabled>Select category</option>
                <option
                  v-for="category in categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <button
                type="button"
                class="btn btn-secondary"
                @click="formSetNewcategory(true)"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
            <!-- category 2 -->
            <div v-if="newCategory" class="mb-3 input-group">
              <span class="input-group-text">Category</span>
              <input
                type="text"
                class="form-control"
                id="productName"
                placeholder="New Category"
                required
                v-model="product.category"
              />
              <button
                type="button"
                class="btn btn-secondary"
                @click="formSetNewcategory(false)"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    type="number"
                    class="form-control"
                    id="sellingPrice"
                    placeholder="Selling Price"
                    min="0"
                    required
                    v-model.number="product.price"
                  />
                  <label for="sellingPrice">Selling Price</label>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-floating">
                  <input
                    type="number"
                    class="form-control"
                    id="costPrice"
                    placeholder="Cost Price"
                    min="0"
                    required
                    v-model.number="product.cost"
                  />
                  <label for="costPrice">Cost Price</label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="isUploading"
              @click.prevent="submitProduct"
            >
              <span v-if="isUploading">
                <i class="bi bi-hourglass-split"></i> Uploading...
              </span>
              <span v-else>
                {{ isEditMode ? "Update Product" : "Save Product" }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

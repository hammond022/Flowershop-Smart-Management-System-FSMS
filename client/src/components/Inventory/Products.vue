<script setup>
import { onMounted, reactive, ref } from "vue";
import { Modal, Toast } from "bootstrap";
import ItemService from "@/router/api/itemsService";
import InventoryProduct from "./Product.vue";

const getFlowers = async () => {
  try {
    flowers.items = await ItemService.getItems();
  } catch (err) {
    console.error(err.message || "Failed to load items");
  } finally {
    flowers.isLoading = false;
  }
};

const flowers = reactive({
  items: [],
  isLoading: true,
});

const product = reactive({
  name: "",
  price: 0,
  quantity: 1,
  tags: ["Birthday", "Happy"],
});

function resetModal() {
  product.name = "";
  product.price = 0;
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
    <button class="btn btn-primary mb-3" @click="toastInstance.show()">
      Show Toast
    </button>

    <div
      id="carouselExampleIndicators"
      class="carousel slide mb-4"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img
            src="../../assets/image.webp"
            height="300rem"
            class="d-block w-100"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            src="../../assets/image.webp"
            height="300rem"
            class="d-block w-100"
            alt="..."
          />
        </div>
        <div class="carousel-item">
          <img
            src="../../assets/image.webp"
            height="300rem"
            class="d-block w-100"
            alt="..."
          />
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <button @click="createProduct" type="button" class="btn btn-primary mb-4">
      Create Product
    </button>

    <!-- Products Table -->
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Tags</th>
          <th>Status</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <InventoryProduct
          v-for="flower in flowers.items"
          :key="flower.name"
          :name="flower.name"
          :quantity="flower.quantity"
          :price="flower.price"
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
              New Product
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

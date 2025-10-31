<script setup>
const props = defineProps({
  id: Number,
  name: String,
  price: Number,
  stock: Number,
  photo: String,
});

const emit = defineEmits(["select"]);
function addItem() {
  emit("select", {
    id: props.id,
    name: props.name,
    price: props.price,
    stock: props.stock,
  });
}
</script>

<template>
  <button @click="addItem" type="button" class="btn btn-outline-secondary item">
    <div class="d-flex align-items-center gap-3">
      <div class="image-container">
        <img class="img-fluid" :src="photo" alt="Item photo" />
      </div>
      <div class="item-details">
        <div class="item-name">{{ name }}</div>
        <div class="item-price">₱{{ price }}</div>
      </div>
      <!-- Stock status badges -->
      <span v-if="stock === 0" class="badge text-bg-danger">Out of stock</span>
      <span v-else-if="stock < 5" class="badge text-bg-warning"
        >stock: {{ stock }}</span
      >
      <span v-else class="badge text-bg-success">stock: {{ stock }}</span>
    </div>
  </button>
</template>

<style scoped>
.item {
  background-size: cover;
  margin: 0.5rem;
  border-radius: 8px;
  height: 7rem;
  width: 19rem;
  transition: all 0.2s ease-in-out;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #6c757d;
}

.image-container {
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  padding: 2px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.item-details {
  text-align: left;
  flex-grow: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.item-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #28a745;
}
</style>

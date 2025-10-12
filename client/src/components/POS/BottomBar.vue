<script setup>
defineProps({
  total: {
    type: Number,
    default: 0,
  },
  orderStarted: {
    type: String,
    default: "",
  },
  selectedFlowers: {
    type: Array,
    default: [],
  },
  hasInvalidStock: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "orderCheckout",
  "cancelOrder",
  "saveAsDraft",
  "addDiscount",
]);
function orderCheckout() {
  emit("orderCheckout");
}
function saveAsDraft() {
  emit("saveAsDraft");
}
function cancelOrder() {
  emit("cancelOrder");
}

function addDiscount() {
  emit("addDiscount");
}
</script>

<template>
  <div class="bottom-bar-container">
    <div class="bottom-bar-inner">
      <!-- <p>Total: {{ total }}</p> -->

      <div class="btn-group">
        <button
          class="btn text-nowrap"
          @click="cancelOrder"
          :disabled="!orderStarted"
          :class="{
            'btn-outline-danger': selectedFlowers.length || !orderStarted,
            'btn-danger': !selectedFlowers.length,
          }"
        >
          Cancel Order
        </button>
        <button
          class="btn btn-outline-warning text-nowrap"
          @click="saveAsDraft"
          :disabled="!orderStarted || !selectedFlowers.length"
        >
          Save as draft
        </button>
        <button
          class="btn text-nowrap"
          @click="orderCheckout"
          :disabled="
            !orderStarted || !selectedFlowers.length || hasInvalidStock
          "
          :class="{
            'btn-success': !hasInvalidStock,
            'btn-danger': hasInvalidStock,
          }"
        >
          Checkout Total ₱{{ total }}
        </button>
      </div>

      <button
        type="button"
        class="btn btn-secondary"
        :disabled="!orderStarted || !selectedFlowers.length"
        @click="addDiscount"
      >
        Add discount
      </button>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar-container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  padding: 1rem;
  border-radius: 0.25rem;
  display: flex;
  justify-content: flex-start;
  /* background-color: ; */
  margin-bottom: 1rem;
}

.bottom-bar-inner {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
</style>

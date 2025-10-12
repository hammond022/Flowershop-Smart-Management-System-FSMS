<script setup>
import { defineProps, computed, defineEmits } from "vue";
import OrderService from "@/router/api/ordersService";

const props = defineProps({
  draft: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["deleteDraft", "loadDraft"]);

const subtotal = computed(() => {
  if (!props.draft?.selectedFlowers) return 0;
  return props.draft.selectedFlowers.reduce(
    (sum, f) => sum + f.price * f.qty,
    0
  );
});

const discountTotal = computed(() => {
  if (!props.draft?.discounts) return 0;
  return props.draft.discounts.reduce((sum, d) => {
    if (d.type === "amount") return sum + d.value;
    if (d.type === "percent") return sum + (subtotal.value * d.value) / 100;
    return sum;
  }, 0);
});

const totalAfterDiscount = computed(() =>
  Math.max(subtotal.value - discountTotal.value, 0)
);

async function deleteDraft() {
  try {
    await OrderService.deleteOrder(props.draft.id);
    emit("deleteDraft", props.draft.id);
  } catch (err) {
    console.error("Failed to delete draft:", err);
  }
}

async function loadDraft() {
  emit("loadDraft", props.draft);
  try {
    await OrderService.deleteOrder(props.draft.id);
    emit("deleteDraft", props.draft.id);
  } catch (err) {
    console.error("Failed to delete draft:", err);
  }
}
</script>

<template>
  <div class="card mb-3 w-100 shadow-sm border-0">
    <div class="card-body border border-secondary-subtle rounded">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-2">
          {{
            draft.actionHistory?.length && draft.actionHistory.at(-1)
              ? draft.actionHistory.at(-1)
              : "Untitled Draft"
          }}
        </h5>
        <button
          type="button"
          class="btn-close"
          aria-label="Delete"
          @click="deleteDraft"
        ></button>
      </div>

      <h6 class="card-subtitle mb-2 text-body-secondary">
        {{ new Date(draft.orderStart).toLocaleString() }}
      </h6>

      <div
        class="accordion mb-3"
        v-if="
          (draft.selectedFlowers && draft.selectedFlowers.length) ||
          (draft.discounts && draft.discounts.length)
        "
      >
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#details-${draft.id}`"
            >
              Order Details
            </button>
          </h2>
          <div :id="`details-${draft.id}`" class="accordion-collapse collapse">
            <div class="accordion-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="flower in draft.selectedFlowers || []"
                  :key="flower.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ flower.qty }}x {{ flower.name }}
                  <span>₱{{ flower.price }}</span>
                </li>

                <li
                  class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                  v-if="subtotal > 0"
                >
                  Subtotal:
                  <span>₱{{ subtotal }}</span>
                </li>

                <li
                  v-for="(d, index) in draft.discounts || []"
                  :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center text-danger"
                >
                  <span>
                    {{
                      d.type === "amount"
                        ? "₱" + d.value + " off"
                        : d.value + "% off"
                    }}
                  </span>
                </li>

                <li
                  v-if="discountTotal > 0"
                  class="list-group-item d-flex justify-content-between align-items-center fw-bold text-danger"
                >
                  Discount Total:
                  <span>-₱{{ discountTotal }}</span>
                </li>

                <li
                  class="list-group-item d-flex justify-content-between align-items-center list-group-item-success fw-bold"
                  v-if="totalAfterDiscount < subtotal"
                >
                  Total After Discount:
                  <span>₱{{ totalAfterDiscount }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-2">
        <a href="#" class="card-link link-danger" @click="deleteDraft">
          Delete
        </a>
        <a href="#" class="card-link link-primary" @click="loadDraft"> Load </a>
      </div>
    </div>
  </div>
</template>

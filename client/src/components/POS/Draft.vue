<script setup>
import { defineProps } from "vue";
import OrderService from "@/router/api/ordersService";

const props = defineProps({
  draft: {
    type: Object,
  },
});

const emit = defineEmits(["deleteDraft"]);
async function deleteDraft() {
  try {
    await OrderService.deleteOrder(props.draft.id);
    emit("deleteDraft", props.draft.id);
  } catch (err) {
    console.error("Failed to delete draft:", err);
  }
}
</script>

<template>
  <div class="card mb-3" style="width: 100%">
    <div class="card-body">
      <div class="d-flex justify-content-between w-100">
        <h5 class="card-title">{{ draft.actionHistory.at(-1) }}</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          @click="deleteDraft()"
        ></button>
      </div>

      <h6 class="card-subtitle mb-2 text-body-secondary">
        {{ new Date(draft.orderStart).toLocaleString() }}
      </h6>
      <!-- <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card’s content.
      </p> -->
      <div
        class="accordion mb-3"
        id="accordionExample"
        v-if="draft.selectedFlowers.length"
      >
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="`#${draft.id}`"
            >
              Items
            </button>
          </h2>
          <div
            :id="draft.id"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="flower in draft.selectedFlowers"
                  :key="flower.id"
                >
                  {{ flower.qty }}x {{ flower.name }}
                  <div>
                    <span>₱{{ flower.price }}</span>
                  </div>
                </li>

                <li
                  class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                >
                  Total:
                  <span>₱{{ total }}</span>
                </li>
              </ul>

              <!--  -->
            </div>
          </div>
        </div>
      </div>
      <a
        href="#"
        class="card-link link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        @click="deleteDraft()"
        >Delete</a
      >
      <a
        href="#"
        class="card-link link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >Load
      </a>
    </div>
  </div>
</template>

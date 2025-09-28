<script setup>
import { defineProps } from "vue";

defineProps({
  draftTitle: {
    type: String,
    default: "Draft title",
  },
  draftTimestamp: {
    type: String,
  },
  draftSelectedFlowers: {
    type: Array,
  },
});
</script>

<template>
  <div class="card" style="width: 100%">
    <div class="card-body">
      <div class="d-flex justify-content-between w-100">
        <h5 class="card-title">Draft title</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>

      <h6 class="card-subtitle mb-2 text-body-secondary">Card subtitle</h6>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card’s content.
      </p>
      <div
        class="accordion mb-3"
        id="accordionExample"
        v-if="selectedFlowers.length"
      >
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Items
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div class="accordion-body">
              <ul class="list-group list-group-flush">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="item in selectedFlowers"
                  :key="item.id"
                >
                  {{ item.qty }}x {{ item.name }}
                  <div>
                    <span>₱{{ item.price }}</span>
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
        >Delete draft</a
      >
      <a
        href="#"
        class="card-link link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
        >Load Draft
      </a>
    </div>
  </div>
</template>

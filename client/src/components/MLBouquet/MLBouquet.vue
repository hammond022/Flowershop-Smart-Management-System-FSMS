<script setup>
import { ref, defineEmits } from "vue";

import { useToast } from "@/composables/useToast";
import NeonSearchBar from "./NeonSearchBar.vue";
import BouquetService from "../../router/api/BouquetService";
import ItemService from "@/router/api/itemsService";

const { showToast } = useToast();

const emit = defineEmits(["add-to-order", "biasDown", "biasUp"]);

const isLoading = ref(false);
const searchTerm = ref("");
const bouquet = ref(null);
const error = ref("");
const excludedIds = ref([]);

function onLiveSearch(value) {
  searchTerm.value = value;
}

const generateBouquet = async () => {
  if (!searchTerm.value.trim()) {
    error.value = "Please enter a theme 🌸";
    return;
  }

  isLoading.value = true;
  error.value = "";
  bouquet.value = null;

  try {
    const data = await BouquetService.suggest(searchTerm.value);
    bouquet.value = data;
    console.log("Bouquet generated successfully:", data);
  } catch (err) {
    error.value = err.response?.data?.error || "Failed to generate bouquet 😢";
    if (err.response?.data?.details) {
      error.value += `: ${err.response.data.details}`;
    }
    console.error("Failed to suggest bouquet:", err);
  } finally {
    isLoading.value = false;
  }
};

const addBouquetToOrder = async () => {
  if (!bouquet.value?.items) {
    error.value = "No bouquet items to add";
    return;
  }

  try {
    isLoading.value = true;

    const itemPromises = bouquet.value.items.map((bouquetItem) =>
      ItemService.getItem(bouquetItem.id).catch((err) => {
        console.warn(`Failed to fetch item ${bouquetItem.id}:`, err);
        return null;
      })
    );

    const latestItems = await Promise.all(itemPromises);

    const bouquetItems = bouquet.value.items.map((bouquetItem, index) => {
      const latestItem = latestItems[index];

      if (!latestItem) {
        return {
          id: bouquetItem.id,
          name: bouquetItem.name,
          price: bouquetItem.price,
          qty: bouquetItem.quantity,
          stock: 0,
          notes: `Part of "${bouquet.value.template.name}" bouquet - Unable to verify stock`,
          oldPrice: bouquetItem.price,
        };
      }

      return {
        id: bouquetItem.id,
        name: latestItem.name || bouquetItem.name,
        price: latestItem.price || bouquetItem.price,
        qty: bouquetItem.quantity,
        stock: latestItem.stock || 0,
        notes: `Part of "${bouquet.value.template.name}" bouquet`,
        oldPrice: latestItem.price || bouquetItem.price,
        category: latestItem.category,
        cost: latestItem.cost,
        photo: latestItem.photo,
      };
    });

    emit("add-to-order", bouquetItems);
    showToast("success", "Bouquet items added to order successfully!");
  } catch (err) {
    console.error("Failed to fetch item data:", err);
    error.value = "Failed to fetch latest item information";
    showToast("danger", "Failed to add bouquet to order");
  } finally {
    isLoading.value = false;
  }
};

const giveFeedback = async (rating) => {
  if (!bouquet.value || !bouquet.value.template?.id) {
    console.warn("No template available for feedback");
    return;
  }

  const templateId = bouquet.value.template.id;

  try {
    console.log(`🗳 Sending feedback: ${rating} for ${templateId}`);
    const res = await BouquetService.feedback(templateId, rating);
    console.log("Feedback recorded:", res);

    if (rating === "down") {
      if (!excludedIds.value.includes(templateId)) {
        excludedIds.value.push(templateId);
      }

      const alternatives =
        bouquet.value?.recommendations?.alternativeTemplates || [];

      const nextAlt = alternatives.find(
        (alt) => !excludedIds.value.includes(alt.id)
      );

      if (nextAlt) {
        console.log("🔁 Using alternative bouquet:", nextAlt.id);

        const newBouquet = await BouquetService.suggest(searchTerm.value, {
          excludeIds: excludedIds.value,
          preferredId: nextAlt.id,
        });

        bouquet.value = newBouquet;
      } else {
        console.log("🔁 No alternatives left, requesting new bouquet...");
        await generateBouquet();
      }
    } else {
      showToast("success", `Feedback recieved`);
    }
  } catch (err) {
    console.error("Failed to record feedback:", err);
    showToast("danger", `Failed to record feedback. Please try again.`);
  }
};
</script>

<template>
  <div class="container shadow-lg">
    <h1 class="text gradient-text text-capitalize">
      {{ selectedCategory }} Custom Bouquet
    </h1>

    <NeonSearchBar
      class="shadow-sm mb-3"
      :loading="isLoading"
      @search="onLiveSearch"
      @handleSearch="generateBouquet"
    />

    <div
      v-if="isLoading"
      class="loading d-flex justify-content-center align-items-center flex-column mt-4"
    >
      <p>Finding the perfect bouquet for you...</p>
      <p class="emoji-animation"></p>
    </div>

    <div v-if="error" class="alert alert-danger text-center m-3">
      {{ error }}
    </div>
    <div
      v-if="bouquet && bouquet.composition.totalItems == 0"
      class="alert alert-warning mx-3"
      role="alert"
    >
      Insufficient amount of flowers in inventory!
    </div>

    <transition name="fade">
      <div
        v-if="bouquet"
        class="result-card border rounded p-4 d-flex justify-content-between align-items-start mx-3 shadow-sm"
      >
        <div class="flex-grow-1">
          <div class="d-flex align-items-center justify-content-between">
            <h2 class="fw-bold mb-0">{{ bouquet.template.name }}</h2>
            <span class="price-badge"
              >₱{{ bouquet.financials.totalPrice }}</span
            >
          </div>
          <div class="mt-2" v-if="bouquet.template.themeTags?.length">
            <span
              class="badge rounded-pill text-bg-primary me-2"
              v-for="t in bouquet.template.themeTags"
              :key="t"
              >{{ t }}</span
            >
          </div>
          <p class="text-muted" v-if="bouquet.template.description">
            {{ bouquet.template.description }}
          </p>
          <button
            class="btn btn-success mt-3"
            :disabled="bouquet.composition.totalItems == 0"
            @click="addBouquetToOrder"
          >
            Add items to order
          </button>
        </div>

        <div class="align-self-start ms-3">
          <i
            class="bi bi-hand-thumbs-up-fill me-1 text-success fs-5"
            @click="giveFeedback('up')"
            role="button"
          ></i>
          <i
            class="bi bi-hand-thumbs-down-fill text-danger fs-5"
            @click="giveFeedback('down')"
            role="button"
          ></i>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="bouquet" class="accordion mx-3 mt-3" id="transactionAccordion">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#itemsCollapse"
              aria-expanded="true"
            >
              Items
            </button>
          </h2>
          <div
            id="itemsCollapse"
            class="accordion-collapse collapse show"
            data-bs-parent="#transactionAccordion"
          >
            <div class="accordion-body">
              <ul class="list-group list-group-flush">
                <li
                  v-for="item in bouquet.items"
                  :key="item.id"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ item.quantity }}x {{ item.name }}
                  <span>₱{{ item.price }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  margin: 1rem 0rem;
  height: 80vh;
}

.text {
  padding: 1rem 0;
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
}

.gradient-text {
  background-image: linear-gradient(45deg, #4a36ff, #322d64);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.loading p {
  font-size: 1.2rem;
  margin: 0.5rem;
}

@keyframes emojiChange {
  0% {
    content: "🌸🌸🌸";
  }
  25% {
    content: "🌸💐🌸";
  }
  50% {
    content: "💐🌸💐";
  }
  75% {
    content: "💐💐💐";
  }
  100% {
    content: "🌸🌸🌸";
  }
}

.emoji-animation::after {
  content: "🌸🌸🌸";
  display: inline-block;
  animation: emojiChange 2s infinite ease-in-out;
}

.result-card {
  background: linear-gradient(135deg, #fff8fc, #f5faff);
  transition: all 0.4s ease;
}

.price-badge {
  background: #e8fff1;
  color: #0f5132;
  border: 1px solid #b6f3ce;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-weight: 600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

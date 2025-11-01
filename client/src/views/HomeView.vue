<script setup>
import { ref } from "vue";
import BouquetService from "../router/api/BouquetService";
import NeonSearchBar from "@/components/MLBouquet/NeonSearchBar.vue";

const theme = ref("");
const isLoading = ref(false);
const bouquet = ref(null);
const error = ref("");
const excludedIds = ref([]); // 🆕 Track excluded bouquet template IDs

const generateBouquet = async () => {
  if (!theme.value.trim()) {
    error.value = "Please enter a theme";
    return;
  }

  isLoading.value = true;
  error.value = "";
  bouquet.value = null;

  try {
    console.log("🔍 Requesting bouquet for theme:", theme.value);

    const data = await BouquetService.suggest(theme.value, {
      excludeIds: excludedIds.value,
    });

    // 🆕 Ensure recommendations exists
    if (!data.recommendations) {
      data.recommendations = {
        alternativeTemplates: [],
      };
    }

    bouquet.value = data;
    console.log("✅ Bouquet generated successfully:", data);
  } catch (err) {
    // ... existing error handling ...
  } finally {
    isLoading.value = false;
  }
};

const giveFeedback = async (rating) => {
  if (!bouquet.value || !bouquet.value.template?.id) {
    console.warn("⚠️ No template available for feedback");
    return;
  }

  const templateId = bouquet.value.template.id;

  try {
    console.log(`🗳 Sending feedback: ${rating} for ${templateId}`);
    const res = await BouquetService.feedback(templateId, rating);
    console.log("✅ Feedback recorded:", res);

    if (rating === "down") {
      // 🆕 Exclude this bouquet
      if (!excludedIds.value.includes(templateId)) {
        excludedIds.value.push(templateId);
      }

      // 🛠️ FIXED: Use optional chaining with safe fallback
      const alternatives =
        bouquet.value?.recommendations?.alternativeTemplates || [];

      const nextAlt = alternatives.find(
        (alt) => !excludedIds.value.includes(alt.id)
      );

      if (nextAlt) {
        console.log("🔁 Using alternative bouquet:", nextAlt.id);

        // Fetch full details for the new bouquet (via backend)
        const newBouquet = await BouquetService.suggest(theme.value, {
          excludeIds: excludedIds.value,
          preferredId: nextAlt.id, // 🆕 backend can use this to prioritize
        });

        bouquet.value = newBouquet; // ✅ Replace entire bouquet object
      } else {
        // No alternatives? Ask backend for a fresh one
        console.log("🔁 No alternatives left, requesting new bouquet...");
        await generateBouquet();
      }
    } else {
      alert("👍 Thanks for your feedback!");
    }
  } catch (err) {
    console.error("❌ Failed to record feedback:", err);
    alert("Failed to record feedback. Please try again.");
  }
};
</script>

<template>
  <NeonSearchBar />

  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">AI Bouquet Generator</h1>
    <p class="text-gray-600 mb-6">Powered by semantic AI matching</p>

    <div class="flex gap-2 mb-8">
      <input
        v-model="theme"
        type="text"
        placeholder="Enter bouquet theme (e.g., romantic wedding, joyful birthday, elegant anniversary)"
        class="border rounded-lg p-3 flex-1 text-lg"
        @keyup.enter="generateBouquet"
      />
      <button
        @click="generateBouquet"
        :disabled="isLoading"
        class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-semibold"
      >
        {{ isLoading ? "🔄 Generating..." : "🎨 Generate Bouquet" }}
      </button>
    </div>

    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
    >
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-if="bouquet" class="space-y-6">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ bouquet.template.name }}
            </h2>
            <p class="text-gray-600 mt-1">{{ bouquet.template.theme }}</p>
            <div class="flex gap-2 mt-2">
              <span
                v-for="tag in bouquet.template.themeTags.slice(0, 4)"
                :key="tag"
                class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-3xl font-bold text-green-600">
              ${{ bouquet.financials.totalPrice }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Cost: ${{ bouquet.financials.totalCost }} • Margin:
              {{ bouquet.financials.profitMarginPercentage }}%
            </p>
          </div>
        </div>
      </div>

      <!-- AI Analysis Section -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">🤖 AI Matching Analysis</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-3 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-700">
              {{ bouquet.matchingAnalysis.templateConfidence }}
            </div>
            <div class="text-sm text-blue-600">Template Confidence</div>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-700">
              {{ bouquet.matchingAnalysis.averageItemConfidence }}
            </div>
            <div class="text-sm text-green-600">Item Match Quality</div>
          </div>
          <div class="text-center p-3 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-700">
              {{ bouquet.matchingAnalysis.processingTime }}
            </div>
            <div class="text-sm text-purple-600">Processing Time</div>
          </div>
          <div class="text-center p-3 bg-orange-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-700">
              {{ bouquet.matchingAnalysis.matchingEngine }}
            </div>
            <div class="text-sm text-orange-600">Matching Engine</div>
          </div>
        </div>
      </div>

      <!-- Bouquet Items with Detailed Matching -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold mb-4">💐 Bouquet Composition</h3>
        <div class="space-y-4">
          <div
            v-for="item in bouquet.items"
            :key="item.id"
            class="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <h4 class="font-semibold text-lg">{{ item.name }}</h4>
                  <span
                    class="bg-green-100 text-green-800 text-sm px-2 py-1 rounded"
                  >
                    {{ item.matchingAnalysis.overallConfidence }} match
                  </span>
                </div>
                <p class="text-gray-600 text-sm mt-1">
                  {{ item.quantity }} stems • ${{ item.price }} each • Stock:
                  {{ item.stock }}
                </p>

                <!-- Matching Breakdown -->
                <div class="mt-3">
                  <div class="flex gap-4 text-xs">
                    <span
                      v-if="
                        item.matchingAnalysis.scoreBreakdown.semantic !== '0.0%'
                      "
                      class="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      Semantic:
                      {{ item.matchingAnalysis.scoreBreakdown.semantic }}
                    </span>
                    <span
                      v-if="
                        item.matchingAnalysis.scoreBreakdown.name !== '0.0%'
                      "
                      class="bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      Name: {{ item.matchingAnalysis.scoreBreakdown.name }}
                    </span>
                    <span
                      v-if="item.matchingAnalysis.scoreBreakdown.tag !== '0.0%'"
                      class="bg-purple-100 text-purple-800 px-2 py-1 rounded"
                    >
                      Tags: {{ item.matchingAnalysis.scoreBreakdown.tag }}
                    </span>
                  </div>
                  <div class="mt-2">
                    <p
                      class="text-xs text-gray-500"
                      v-for="reason in item.matchingAnalysis.matchReasons"
                      :key="reason"
                    >
                      ✓ {{ reason }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-lg">${{ item.totalPrice }}</p>
                <p class="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alternative Suggestions -->
      <div
        v-if="bouquet.recommendations?.alternativeTemplates?.length > 0"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <h3 class="text-lg font-semibold mb-4">🔄 Alternative Templates</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div
            v-for="alt in bouquet.recommendations?.alternativeTemplates || []"
            :key="alt.id"
            class="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
          >
            <h4 class="font-medium">{{ alt.name }}</h4>
            <p class="text-sm text-gray-600">{{ alt.theme }}</p>
            <div class="flex justify-between items-center mt-2">
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {{ alt.confidence }}
              </span>
              <span class="text-xs text-gray-500">{{ alt.matchType }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="font-semibold">Total Items:</span>
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">{{
              bouquet.composition.totalItems
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Total Stems:</span>
            <span class="bg-green-100 text-green-800 px-2 py-1 rounded">{{
              bouquet.composition.totalQuantity
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Stock Usage:</span>
            <span class="bg-orange-100 text-orange-800 px-2 py-1 rounded">{{
              bouquet.composition.stockUtilization
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">Generated:</span>
            <span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">
              {{ new Date(bouquet.metadata.generatedAt).toLocaleTimeString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Feedback Buttons -->
      <div v-if="bouquet" class="mt-6 flex justify-center gap-6">
        <button
          @click="giveFeedback('up')"
          class="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-6 py-3 rounded-xl transition-all"
        >
          👍 Like this bouquet
        </button>
        <button
          @click="giveFeedback('down')"
          class="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-6 py-3 rounded-xl transition-all"
        >
          👎 Not a good match
        </button>
      </div>
    </div>
  </div>
</template>

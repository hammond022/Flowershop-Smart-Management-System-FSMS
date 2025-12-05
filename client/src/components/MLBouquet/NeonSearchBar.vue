<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["search", "handleSearch"]);
const props = defineProps({
  loading: { type: Boolean, default: false },
});

const query = ref("");

function handleSearch() {
  emit("handleSearch", query.value);
}

watch(query, (newValue) => {
  emit("search", newValue);
});
</script>

<template>
  <div class="neon-search-container" :class="{ 'fast-anim': props.loading }">
    <div class="input-group">
      <input
        v-model="query"
        type="text"
        class="form-control neon-input"
        placeholder="Search..."
        @keyup.enter="handleSearch"
      />
      <button class="btn btn-outline-light" @click="handleSearch">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.neon-search-container {
  position: relative;
  display: inline-block;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(90deg, #0ff, #f0f, #0ff);
  background-size: 200% 200%;
  animation: neon-border 10s linear infinite;
}

.fast-anim {
  animation-duration: 0.5s;
}

.neon-input {
  border: none;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 0 10px #0ff4;
  transition: box-shadow 0.3s ease;
}

.neon-input:focus {
  outline: none;
  box-shadow: 0 0 20px #0ff8;
}

.btn {
  border-radius: 10px;
  background-color: #ffffff;
  border: none;
  color: #0ff;
  transition: all 0.3s ease;
}

.btn:hover {
  color: #000;
}

@keyframes neon-border {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

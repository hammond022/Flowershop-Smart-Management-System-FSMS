<script setup>
import { defineProps } from "vue";

defineProps({
  orderStart: {
    type: String,
    default: "Pending",
  },
});
</script>

<template>
  <div class="container">
    <div class="inner-container">
      <img src="../../assets/icons/user.svg" width="70" alt="" />
      <div class="text-container">
        <div class="lowlight">ADMIN</div>
        <div class="primary">John Doe</div>
      </div>
    </div>
    <div class="inner-container">
      <div>
        <div class="lowlight">ORDER START</div>
        <div>{{ orderStart }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  margin: 1rem;
  width: 100%;
}

.inner-container {
  display: flex;
  align-items: center;
}

.text-container {
  padding: 1rem;
}
.lowlight {
  opacity: 50%;
}
.primary {
  font-size: large;
}
</style>

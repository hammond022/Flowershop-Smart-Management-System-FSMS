<script setup>
import { reactive, ref, watch, computed } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";
import { auth } from "@/auth.js";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const { showToast } = useToast();
const saving = ref(false);
const permissions = reactive({});

const isEditingSelf = computed(() => {
  return auth.user && props.user && auth.user.id === props.user.id;
});

async function loadPermissions() {
  try {
    const userData = await UsersService.getUser(props.user.id);
    Object.keys(permissions).forEach((k) => delete permissions[k]); // clear

    for (const category in userData.role) {
      const role = userData.role[category];
      if (typeof role === "object" && role !== null) {
        permissions[category] = { ...role };
      }
    }
  } catch (err) {
    console.error("Failed to load permissions:", err);
    showToast(
      "error",
      err.response?.data?.error || "Failed to load permissions"
    );
  }
}

async function savePermissions() {
  saving.value = true;
  try {
    await UsersService.updateUserPermissions(props.user.id, permissions);
    showToast("success", "Permissions saved successfully!");
  } catch (err) {
    console.error("Failed to save permissions:", err);
    showToast(
      "error",
      err.response?.data?.error || "Failed to save permissions"
    );
  } finally {
    saving.value = false;
  }
}

function resetPermissions() {
  loadPermissions();
}

watch(
  () => props.user,
  () => {
    loadPermissions();
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <h4 class="fw-bold">{{ user.username }}</h4>
    <hr />

    <fieldset :disabled="isEditingSelf">
      <div
        v-for="(perms, category) in permissions"
        :key="category"
        class="mb-4"
      >
        <h6 class="text-uppercase fw-bold">{{ category }}</h6>
        <div class="ms-3">
          <div
            v-for="(enabled, permKey) in perms"
            :key="permKey"
            class="form-check form-switch mb-2"
          >
            <input
              class="form-check-input"
              type="checkbox"
              v-model="permissions[category][permKey]"
              :id="`${category}-${permKey}`"
            />
            <label class="form-check-label" :for="`${category}-${permKey}`">
              {{ permKey }}
            </label>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2">
        <button
          class="btn btn-primary"
          @click="savePermissions"
          :disabled="saving"
        >
          <span v-if="!saving">Save Changes</span>
          <span v-else>Saving...</span>
        </button>
        <button
          class="btn btn-outline-secondary"
          @click="resetPermissions"
          :disabled="saving"
        >
          Reset
        </button>
      </div>
    </fieldset>

    <div v-if="isEditingSelf" class="alert alert-warning mt-3" role="alert">
      You cannot edit your own permissions.
    </div>
  </div>
</template>

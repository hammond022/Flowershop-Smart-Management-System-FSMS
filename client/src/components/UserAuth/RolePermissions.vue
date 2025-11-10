<script setup>
// ill have to worry about this later but users and roles are
// being fetched dynamically everytime a new user is picked
// instead this page should just load the entire users array
// in the database
//!todo fetch user permissions on mounted
import { reactive, ref, watch, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const { showToast } = useToast();
const saving = ref(false);
const permissions = reactive({});

// Fetch user permissions from backend
async function loadPermissions() {
  try {
    const userData = await UsersService.getUser(props.user.id);

    // Deep copy to reactive object
    for (const category in userData.role) {
      // Only handle array-based permissions
      if (Array.isArray(userData.role[category])) {
        permissions[category] = userData.role[category].map((perm) => ({
          key: perm.key,
          label: perm.label,
          enabled: perm.enabled,
        }));
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

// Save updated permissions to backend
async function savePermissions() {
  saving.value = true;
  try {
    console.log("Saving permissions for user:", props.user);
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

// Reset permissions to the last loaded state from backend
function resetPermissions() {
  loadPermissions();
}

// Watch for changes in selected user and reload permissions
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
    <h4 class="fw-bold">{{ user.name }}</h4>
    <hr />

    <div v-for="(perms, category) in permissions" :key="category" class="mb-4">
      <h6 class="text-uppercase text-secondary fw-bold">{{ category }}</h6>
      <div class="ms-3">
        <div
          v-for="perm in perms"
          :key="perm.key"
          class="form-check form-switch mb-2"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="perm.enabled"
            :id="`${category}-${perm.key}`"
          />
          <label class="form-check-label" :for="`${category}-${perm.key}`">
            {{ perm.label }}
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
  </div>
</template>

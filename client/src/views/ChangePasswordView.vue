<script setup>
import { ref, watch } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";
import { auth } from "@/auth.js";
import { useRouter } from "vue-router";
import api from "@/axios.js";
import { validatePassword } from "@/utils/passwordValidation";

const router = useRouter();
const { showToast } = useToast();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errors = ref({});
const submitting = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordValidation = ref({ isValid: false, errors: [] });

watch(newPassword, (value) => {
  if (value) {
    passwordValidation.value = validatePassword(value);
  } else {
    passwordValidation.value = { isValid: false, errors: [] };
  }
});

function validate() {
  errors.value = {};
  if (!currentPassword.value) {
    errors.value.currentPassword = "Current password is required";
  }
  
  const validation = validatePassword(newPassword.value);
  if (!validation.isValid) {
    errors.value.newPassword = "Password does not meet requirements";
  }
  
  if (newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Passwords do not match";
  }
  return Object.keys(errors.value).length === 0;
}

async function submit() {
  if (!validate()) return;
  submitting.value = true;
  try {
    if (!auth.user?.id) throw new Error("No authenticated user");
    const verifyToken = btoa(`${auth.user.username}:${currentPassword.value}`);
    const verifyRes = await api.get("/users/me", {
      headers: { Authorization: `Basic ${verifyToken}` },
    });
    if (verifyRes.status !== 200) {
      errors.value.currentPassword = "Current password is incorrect";
      showToast("error", "Current password is incorrect");
      return;
    }

    await UsersService.updateSelf(auth.user.id, {
      password: newPassword.value,
    });
    showToast("success", "Password changed successfully. Please log in again.");
    auth.logout();
    router.push({ name: "login" });
  } catch (err) {
    console.error("Change password failed", err);
    showToast(
      "error",
      err.response?.data?.error || err.message || "Failed to change password"
    );
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Change Password</h5>
            <p class="text-muted">Update your account password.</p>

            <form @submit.prevent="submit">
              <div class="mb-3">
                <label class="form-label small">Current Password</label>
                <div class="input-group input-group-sm">
                  <input
                    :type="showCurrentPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="currentPassword"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    :aria-label="showCurrentPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showCurrentPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small">New Password</label>
                <div class="input-group input-group-sm">
                  <input
                    :type="showNewPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="newPassword"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    :aria-label="showNewPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div class="text-danger small mt-1" v-if="errors.newPassword">
                  {{ errors.newPassword }}
                </div>
                <div v-if="newPassword" class="mt-2">
                  <div class="small text-muted mb-1">Password must contain:</div>
                  <ul class="list-unstyled small mb-0">
                    <li :class="passwordValidation.errors.includes('At least 8 characters') ? 'text-danger' : 'text-success'">
                      <i :class="passwordValidation.errors.includes('At least 8 characters') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                      At least 8 characters
                    </li>
                    <li :class="passwordValidation.errors.includes('At least 1 lowercase letter') ? 'text-danger' : 'text-success'">
                      <i :class="passwordValidation.errors.includes('At least 1 lowercase letter') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                      At least 1 lowercase letter
                    </li>
                    <li :class="passwordValidation.errors.includes('At least 1 uppercase letter') ? 'text-danger' : 'text-success'">
                      <i :class="passwordValidation.errors.includes('At least 1 uppercase letter') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                      At least 1 uppercase letter
                    </li>
                    <li :class="passwordValidation.errors.includes('At least 1 digit') ? 'text-danger' : 'text-success'">
                      <i :class="passwordValidation.errors.includes('At least 1 digit') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                      At least 1 digit
                    </li>
                    <li :class="passwordValidation.errors.includes('At least 1 special character') ? 'text-danger' : 'text-success'">
                      <i :class="passwordValidation.errors.includes('At least 1 special character') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                      At least 1 special character
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small">Confirm New Password</label>
                <div class="input-group input-group-sm">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="form-control"
                    v-model="confirmPassword"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                  >
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div
                  class="text-danger small mt-1"
                  v-if="errors.confirmPassword"
                >
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="$router.back()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  <span v-if="!submitting">Change password</span>
                  <span v-else>Saving...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

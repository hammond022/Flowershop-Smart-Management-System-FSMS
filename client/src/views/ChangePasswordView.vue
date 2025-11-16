<script setup>
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";
import { auth } from "@/auth.js";
import { useRouter } from "vue-router";

const router = useRouter();
const { showToast } = useToast();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const errors = ref({});
const submitting = ref(false);

function validate() {
  errors.value = {};
  if (!currentPassword.value) {
    errors.value.currentPassword = "Current password is required";
  }
  if (!newPassword.value || newPassword.value.length < 6) {
    errors.value.newPassword = "New password must be at least 6 characters";
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
    const verifyRes = await fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Basic ${verifyToken}` },
    });
    if (!verifyRes.ok) {
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
                <input
                  type="password"
                  class="form-control"
                  v-model="currentPassword"
                />
              </div>

              <div class="mb-3">
                <label class="form-label small">New Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="newPassword"
                />
                <div class="text-danger small mt-1" v-if="errors.newPassword">
                  {{ errors.newPassword }}
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label small">Confirm New Password</label>
                <input
                  type="password"
                  class="form-control"
                  v-model="confirmPassword"
                />
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

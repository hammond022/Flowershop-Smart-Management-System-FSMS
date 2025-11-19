<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";

import UserSidebar from "../components/UserAuth/Users.vue";
import PermissionPanel from "../components/UserAuth/RolePermissions.vue";
import { Modal } from "bootstrap";
import { validatePassword } from "@/utils/passwordValidation";

const { showToast } = useToast();

const users = ref([]);
const selectedUser = ref(null);
const bsModalInstance = ref(null);

const cuUsername = ref("");
const cuPassword = ref("");
const cuIsAdmin = ref(false);
const cuErrors = ref({});
const cuSubmitting = ref(false);
const showCuPassword = ref(false);
const cuPasswordValidation = ref({ isValid: false, errors: [] });

watch(cuPassword, (value) => {
  if (value) {
    cuPasswordValidation.value = validatePassword(value);
  } else {
    cuPasswordValidation.value = { isValid: false, errors: [] };
  }
});

function resetCreateForm() {
  cuUsername.value = "";
  cuPassword.value = "";
  cuIsAdmin.value = false;
  cuErrors.value = {};
  cuSubmitting.value = false;
  showCuPassword.value = false;
  cuPasswordValidation.value = { isValid: false, errors: [] };
}

async function submitCreateUser() {
  cuErrors.value = {};
  if (!cuUsername.value) cuErrors.value.username = "Username is required";
  
  const validation = validatePassword(cuPassword.value);
  if (!validation.isValid) {
    cuErrors.value.password = "Password does not meet requirements";
  }
  
  if (Object.keys(cuErrors.value).length) return;

  cuSubmitting.value = true;
  try {
    const role = { admin: { isAdmin: !!cuIsAdmin.value } };
    const newUser = await UsersService.createUser({
      username: cuUsername.value,
      password: cuPassword.value,
      role,
    });
    users.value = users.value || [];
    users.value.unshift(newUser);
    showToast("success", "User created successfully");
    // hide bootstrap modal
    bsModalInstance.value?.hide();
    resetCreateForm();
  } catch (err) {
    console.error("Create user failed", err);
    const msg =
      err.response?.data?.error || err.message || "Failed to create user";
    showToast("error", msg);
  } finally {
    cuSubmitting.value = false;
  }
}

async function fetchUsers() {
  try {
    const list = await UsersService.getUsers();
    users.value = list || [];
  } catch (err) {
    console.error("Failed to fetch users:", err);
    showToast("error", err.response?.data?.error || "Failed to load users");
  }
}

function handleSelectUser(user) {
  selectedUser.value = user;
}

function handleOpenCreate() {
  // show Bootstrap modal
  const modalEl = document.getElementById("createUserModal");
  if (!modalEl) {
    console.warn("Create user modal element not found");
    return;
  }
  if (!bsModalInstance.value) bsModalInstance.value = new Modal(modalEl);
  bsModalInstance.value.show();
}

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="container-fluid vh-100">
    <div class="row h-100">
      <!-- Sidebar -->
      <div class="col-12 col-md-4 col-lg-3 border-end bg-light p-0">
        <UserSidebar
          :users="users"
          :selectedUser="selectedUser"
          @selectUser="handleSelectUser"
          @createUser="handleOpenCreate"
        />
      </div>

      <!-- Main Panel -->
      <div class="col-12 col-md-8 col-lg-9 p-4">
        <PermissionPanel v-if="selectedUser" :user="selectedUser" />

        <!-- Bootstrap native modal for Create User -->
        <div
          class="modal fade"
          id="createUserModal"
          tabindex="-1"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Create User</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="submitCreateUser">
                  <div class="mb-3">
                    <label class="form-label small">Username</label>
                    <input class="form-control" v-model="cuUsername" />
                    <div
                      class="text-danger small mt-1"
                      v-if="cuErrors.username"
                    >
                      {{ cuErrors.username }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label small">Temporary Password</label>
                    <div class="input-group input-group-sm">
                      <input
                        :type="showCuPassword ? 'text' : 'password'"
                        class="form-control"
                        v-model="cuPassword"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showCuPassword = !showCuPassword"
                        :aria-label="showCuPassword ? 'Hide password' : 'Show password'"
                      >
                        <i :class="showCuPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                      </button>
                    </div>
                    <div
                      class="text-danger small mt-1"
                      v-if="cuErrors.password"
                    >
                      {{ cuErrors.password }}
                    </div>
                    <div v-if="cuPassword" class="mt-2">
                      <div class="small text-muted mb-1">Password must contain:</div>
                      <ul class="list-unstyled small mb-0">
                        <li :class="cuPasswordValidation.errors.includes('At least 8 characters') ? 'text-danger' : 'text-success'">
                          <i :class="cuPasswordValidation.errors.includes('At least 8 characters') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                          At least 8 characters
                        </li>
                        <li :class="cuPasswordValidation.errors.includes('At least 1 lowercase letter') ? 'text-danger' : 'text-success'">
                          <i :class="cuPasswordValidation.errors.includes('At least 1 lowercase letter') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                          At least 1 lowercase letter
                        </li>
                        <li :class="cuPasswordValidation.errors.includes('At least 1 uppercase letter') ? 'text-danger' : 'text-success'">
                          <i :class="cuPasswordValidation.errors.includes('At least 1 uppercase letter') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                          At least 1 uppercase letter
                        </li>
                        <li :class="cuPasswordValidation.errors.includes('At least 1 digit') ? 'text-danger' : 'text-success'">
                          <i :class="cuPasswordValidation.errors.includes('At least 1 digit') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                          At least 1 digit
                        </li>
                        <li :class="cuPasswordValidation.errors.includes('At least 1 special character') ? 'text-danger' : 'text-success'">
                          <i :class="cuPasswordValidation.errors.includes('At least 1 special character') ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                          At least 1 special character
                        </li>
                      </ul>
                    </div>
                    <div class="form-text">
                      Admin should instruct the user to change password after
                      first login.
                    </div>
                  </div>

                  <div class="form-check form-switch mb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="cuIsAdmin"
                      v-model="cuIsAdmin"
                    />
                    <label class="form-check-label small" for="cuIsAdmin"
                      >Make user an admin</label
                    >
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="cuSubmitting"
                    >
                      <span v-if="!cuSubmitting">Create user</span>
                      <span v-else>Creating...</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!selectedUser" class="text-center text-muted mt-5">
          <p>Select a user to manage permissions</p>
        </div>
      </div>
    </div>
  </div>
</template>

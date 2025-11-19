<script setup>
import { reactive, ref, watch, computed } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";
import { auth } from "@/auth.js";
import { validatePassword } from "@/utils/passwordValidation";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const { showToast } = useToast();
const saving = ref(false);
const permissions = reactive({});

const accountSaving = ref(false);
const formUsername = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const accountErrors = reactive({});
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

const isEditingSelf = computed(() => {
  return auth.user && props.user && auth.user.id === props.user.id;
});

const isAdminUser = computed(
  () =>
    !!(
      auth.user &&
      auth.user.role &&
      auth.user.role.admin &&
      auth.user.role.admin.isAdmin
    )
);

async function loadPermissions() {
  try {
    const userData = await UsersService.getUser(props.user.id);
    Object.keys(permissions).forEach((k) => delete permissions[k]);

    formUsername.value = userData.username || "";
    newPassword.value = "";
    confirmPassword.value = "";
    showNewPassword.value = false;
    showConfirmPassword.value = false;
    passwordValidation.value = { isValid: false, errors: [] };

    Object.keys(accountErrors).forEach((k) => delete accountErrors[k]);

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

async function saveAccount() {
  Object.keys(accountErrors).forEach((k) => delete accountErrors[k]);

  const payload = {};
  const isAdmin = isAdminUser.value;

  if (isAdmin && !isEditingSelf.value) {
    if (!formUsername.value) {
      accountErrors.username = "Username cannot be empty";
    } else {
      payload.username = formUsername.value;
    }
  }

  const wantsPasswordChange = newPassword.value || confirmPassword.value;
  if (wantsPasswordChange) {
    const validation = validatePassword(newPassword.value);
    if (!validation.isValid) {
      accountErrors.newPassword = "Password does not meet requirements";
    }

    if (!confirmPassword.value) {
      accountErrors.confirmPassword = "Please confirm the new password";
    } else if (
      newPassword.value &&
      newPassword.value !== confirmPassword.value
    ) {
      accountErrors.confirmPassword = "Passwords do not match";
    }

    if (!accountErrors.newPassword && !accountErrors.confirmPassword) {
      payload.password = newPassword.value;
    }
  }

  if (Object.keys(accountErrors).length) {
    showToast("error", "Please fix the form errors before saving");
    return;
  }

  if (Object.keys(payload).length === 0) {
    showToast("warning", "No changes to save");
    return;
  }

  accountSaving.value = true;
  try {
    const isSelf = auth.user && auth.user.id === props.user.id;
    let updatedUser;
    if (isSelf) {
      updatedUser = await UsersService.updateSelf(props.user.id, payload);
    } else {
      updatedUser = await UsersService.updateUser(props.user.id, payload);
    }
    showToast("success", "Account updated successfully");

    if (isSelf) {
      auth.user = { ...auth.user, ...updatedUser };
      const usernameChanged = !!payload.username;
      const passwordChanged = !!payload.password;
      if (passwordChanged) {
        const newUser = payload.username || auth.user.username;
        auth.credentials = btoa(`${newUser}:${payload.password}`);
        localStorage.setItem("authToken", auth.credentials);
      } else if (usernameChanged) {
        showToast("info", "Username changed. Please login again.");
        auth.logout();
      }
    }

    await loadPermissions();
  } catch (err) {
    console.error("Failed to update account:", err);
    showToast("error", err.response?.data?.error || "Failed to update account");
  } finally {
    accountSaving.value = false;
  }
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
  <div class="container-fluid p-0">
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <div
            class="rounded-circle bg-secondary text-primary d-flex align-items-center justify-content-center me-3"
            style="width: 48px; height: 48px"
            :class="{ 'text-success': user?.role?.admin?.isAdmin }"
          >
            <strong>{{ (user.username || "").charAt(0).toUpperCase() }}</strong>
          </div>
          <div class="flex-grow-1">
            <h5 class="mb-0">{{ user.username }}</h5>
            <small class="text-muted">User ID: {{ user.id }}</small>
          </div>
          <div>
            <span
              v-if="permissions.admin && permissions.admin.isAdmin"
              class="badge bg-primary"
              >Admin</span
            >
          </div>
        </div>

        <div class="row g-3">
          <div class="col-12 col-lg-4">
            <div class="card border-0">
              <div class="card-body">
                <h6 class="card-title">Account</h6>

                <div class="mb-3" v-if="isAdminUser && !isEditingSelf">
                  <label class="form-label small mb-1">Username</label>
                  <input
                    class="form-control form-control-sm"
                    v-model="formUsername"
                  />
                  <div
                    class="text-danger small mt-1"
                    v-if="accountErrors.username"
                  >
                    {{ accountErrors.username }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small mb-1">New Password</label>
                  <div class="input-group input-group-sm">
                    <input
                      :type="showNewPassword ? 'text' : 'password'"
                      class="form-control form-control-sm"
                      v-model="newPassword"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showNewPassword = !showNewPassword"
                      :aria-label="
                        showNewPassword ? 'Hide password' : 'Show password'
                      "
                    >
                      <i
                        :class="
                          showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <div
                    class="text-danger small mt-1"
                    v-if="accountErrors.newPassword"
                  >
                    {{ accountErrors.newPassword }}
                  </div>
                  <div v-if="newPassword" class="mt-2">
                    <div class="small text-muted mb-1">
                      Password must contain:
                    </div>
                    <ul class="list-unstyled small mb-0">
                      <li
                        :class="
                          passwordValidation.errors.includes(
                            'At least 8 characters'
                          )
                            ? 'text-danger'
                            : 'text-success'
                        "
                      >
                        <i
                          :class="
                            passwordValidation.errors.includes(
                              'At least 8 characters'
                            )
                              ? 'bi bi-x-circle'
                              : 'bi bi-check-circle'
                          "
                        ></i>
                        At least 8 characters
                      </li>
                      <li
                        :class="
                          passwordValidation.errors.includes(
                            'At least 1 lowercase letter'
                          )
                            ? 'text-danger'
                            : 'text-success'
                        "
                      >
                        <i
                          :class="
                            passwordValidation.errors.includes(
                              'At least 1 lowercase letter'
                            )
                              ? 'bi bi-x-circle'
                              : 'bi bi-check-circle'
                          "
                        ></i>
                        At least 1 lowercase letter
                      </li>
                      <li
                        :class="
                          passwordValidation.errors.includes(
                            'At least 1 uppercase letter'
                          )
                            ? 'text-danger'
                            : 'text-success'
                        "
                      >
                        <i
                          :class="
                            passwordValidation.errors.includes(
                              'At least 1 uppercase letter'
                            )
                              ? 'bi bi-x-circle'
                              : 'bi bi-check-circle'
                          "
                        ></i>
                        At least 1 uppercase letter
                      </li>
                      <li
                        :class="
                          passwordValidation.errors.includes('At least 1 digit')
                            ? 'text-danger'
                            : 'text-success'
                        "
                      >
                        <i
                          :class="
                            passwordValidation.errors.includes(
                              'At least 1 digit'
                            )
                              ? 'bi bi-x-circle'
                              : 'bi bi-check-circle'
                          "
                        ></i>
                        At least 1 digit
                      </li>
                      <li
                        :class="
                          passwordValidation.errors.includes(
                            'At least 1 special character'
                          )
                            ? 'text-danger'
                            : 'text-success'
                        "
                      >
                        <i
                          :class="
                            passwordValidation.errors.includes(
                              'At least 1 special character'
                            )
                              ? 'bi bi-x-circle'
                              : 'bi bi-check-circle'
                          "
                        ></i>
                        At least 1 special character
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label small mb-1">Confirm Password</label>
                  <div class="input-group input-group-sm">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="form-control form-control-sm"
                      v-model="confirmPassword"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      :aria-label="
                        showConfirmPassword ? 'Hide password' : 'Show password'
                      "
                    >
                      <i
                        :class="
                          showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                        "
                      ></i>
                    </button>
                  </div>
                  <div
                    class="text-danger small mt-1"
                    v-if="accountErrors.confirmPassword"
                  >
                    {{ accountErrors.confirmPassword }}
                  </div>
                </div>

                <div class="d-grid">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="saveAccount"
                    :disabled="accountSaving"
                  >
                    <span v-if="!accountSaving">Save Account</span>
                    <span v-else>Saving...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-8">
            <div class="card border-0">
              <div class="card-body">
                <h6 class="card-title">Permissions</h6>

                <div
                  v-if="isEditingSelf"
                  class="alert alert-warning small"
                  role="alert"
                >
                  You cannot edit your own permissions.
                </div>

                <div class="accordion" id="permissionsAccordion">
                  <div
                    class="accordion-item"
                    v-for="(perms, category, idx) in permissions"
                    :key="category"
                  >
                    <h2 class="accordion-header" :id="`heading-${idx}`">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-${idx}`"
                        aria-expanded="false"
                        :aria-controls="`collapse-${idx}`"
                      >
                        {{ category }}
                      </button>
                    </h2>
                    <div
                      :id="`collapse-${idx}`"
                      class="accordion-collapse collapse"
                      :aria-labelledby="`heading-${idx}`"
                      data-bs-parent="#permissionsAccordion"
                    >
                      <div class="accordion-body">
                        <div class="row">
                          <div
                            class="col-12 col-md-6 mb-2"
                            v-for="(val, key) in perms"
                            :key="key"
                          >
                            <div class="form-check form-switch">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="permissions[category][key]"
                                :id="`${category}-${key}`"
                                :disabled="isEditingSelf"
                              />
                              <label
                                class="form-check-label small"
                                :for="`${category}-${key}`"
                                >{{ key }}</label
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-3 d-flex gap-2">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="savePermissions"
                    :disabled="saving"
                  >
                    <span v-if="!saving">Save Permissions</span>
                    <span v-else>Saving...</span>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="resetPermissions"
                    :disabled="saving"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import UsersService from "@/router/api/UsersService";

import UserSidebar from "../components/UserAuth/Users.vue";
import PermissionPanel from "../components/UserAuth/RolePermissions.vue";

const { showToast } = useToast();

const users = ref([]);
const selectedUser = ref(null);

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
        />
      </div>

      <!-- Main Panel -->
      <div class="col-12 col-md-8 col-lg-9 p-4">
        <PermissionPanel v-if="selectedUser" :user="selectedUser" />
        <div v-else class="text-center text-muted mt-5">
          <p>Select a user to manage permissions</p>
        </div>
      </div>
    </div>
  </div>
</template>

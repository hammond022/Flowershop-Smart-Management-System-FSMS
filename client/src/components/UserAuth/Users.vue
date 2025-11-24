<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["selectUser", "createUser"]);

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  selectedUser: {
    type: Object,
    default: null,
  },
});

const search = ref("");
const filteredUsers = computed(() => {
  const q = (search.value || "").toLowerCase().trim();
  if (!q) return props.users || [];
  return (props.users || []).filter((u) =>
    (u.username || "").toLowerCase().includes(q)
  );
});
</script>

<template>
  <div class="d-flex flex-column h-100 overflow-auto">
    <div class="p-3 border-bottom">
      <div class="d-flex align-items-center gap-2">
        <input
          class="form-control form-control-sm"
          placeholder="Search users..."
          v-model="search"
        />
        <button class="btn btn-sm btn-primary" @click="emit('createUser')">
          Create
        </button>
      </div>
    </div>

    <div class="list-group list-group-flush flex-grow-1 overflow-auto">
      <button
        v-for="user in filteredUsers"
        :key="user.id"
        type="button"
        class="list-group-item list-group-item-action d-flex align-items-center"
        :class="{
          active: props.selectedUser && user.id === props.selectedUser.id,
        }"
        @click="emit('selectUser', user)"
      >
        <div
          class="rounded-circle bg-secondary text-primary d-flex align-items-center justify-content-center me-3"
          style="width: 36px; height: 36px"
          :class="{ 'text-success': user?.role?.admin?.isAdmin }"
        >
          <strong class="small">{{
            (user.username || "").charAt(0).toUpperCase()
          }}</strong>
        </div>
        <div class="flex-grow-1 text-start">
          <div class="fw-medium">{{ user.username }}</div>
          <small class="text-muted">ID: {{ user.id }}</small>
        </div>
        <div v-if="user?.role?.admin?.isAdmin">
          <span class="badge bg-primary">Admin</span>
        </div>
      </button>
    </div>
  </div>
</template>

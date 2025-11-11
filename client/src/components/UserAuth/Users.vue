<script setup>
const emit = defineEmits(["selectUser"]);

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
</script>

<template>
  <div class="d-flex flex-column h-100 overflow-auto">
    <h5 class="p-3 border-bottom mb-0">Users</h5>

    <ul class="list-group list-group-flush flex-grow-1">
      <li
        v-for="user in props.users"
        :key="user.id"
        class="list-group-item list-group-item-action d-flex flex-column"
        :class="{
          active:
            props.selectedUser && user.username === props.selectedUser.username,
        }"
        @click="emit('selectUser', user)"
        style="cursor: pointer"
      >
        <div class="fw-semibold">{{ user.username }}</div>
      </li>
    </ul>
  </div>
</template>

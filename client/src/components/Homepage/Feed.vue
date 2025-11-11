<script setup>
import { defineProps } from "vue";
import FeedItem from "./FeedItem.vue";
import Salutation from "../Inventory/Salutation.vue";

const props = defineProps({
  feed: {
    type: Array,
    required: true,
  },
});
</script>
<template>
  <Salutation />
  <div>
    <FeedItem v-for="post in feed" :key="post.id" :item="post" />
  </div>
</template>

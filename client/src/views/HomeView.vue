<script setup>
import { ref } from "vue";

import HomeSidebar from "@/components/Homepage/HomeSidebar.vue";
import Feed from "@/components/Homepage/Feed.vue";
import PurchaseOrderLog from "@/components/Homepage/PurchaseOrderLog.vue";

// Mock feed data
const feed = ref([
  {
    id: 1,
    user: "octocat",
    avatar: "https://github.com/octocat.png",
    content: "Created a new repository: vue-project",
    time: "2h ago",
  },
  {
    id: 2,
    user: "octocat",
    avatar: "https://github.com/octocat.png",
    content: "Opened a new issue in vue-project",
    time: "4h ago",
  },
  {
    id: 3,
    user: "octocat",
    avatar: "https://github.com/octocat.png",
    content: "Merged pull request #2 in vue-project",
    time: "1d ago",
  },
]);

// Mock repositories
const repositories = ref([
  { id: 1, name: "vue-project" },
  { id: 2, name: "bootstrap-website" },
  { id: 3, name: "github-clone" },
]);

// Mock trending repositories
const trending = ref([
  { id: 1, name: "1760362397573", stars: 200000 },
  { id: 2, name: "react", stars: 210000 },
  { id: 3, name: "bootstrap", stars: 160000 },
]);
</script>

<template>
  <div class="container-fluid p-0 bg-light">
    <div class="mt-3 px-4">
      <div class="row">
        <div class="col-md-3 mb-4">
          <HomeSidebar :repositories="repositories" />
        </div>

        <div class="col-md-6 mb-4">
          <Feed :feed="feed" />
        </div>

        <div class="col-md-3 mb-4">
          <PurchaseOrderLog :trending="trending" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: #f6f8fa;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}
</style>

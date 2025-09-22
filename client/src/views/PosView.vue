<script setup>
import { ref } from "vue";
import { posSelected } from "@/stores/posSelected";
import CurrentUser from "@/components/POS/CurrentUser.vue";
import Categories from "@/components/POS/Categories.vue";
import Items from "@/components/POS/Items.vue";
// import QuantityAdjuster from "@/components/QuantityAdjuster.vue";
import PosBottomBar from "@/components/POS/PosBottomBar.vue";
</script>

<template>
  <div class="container-fluid">
    <div class="row h-100">
      <div class="col-4">
        <CurrentUser />

        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="item in posSelected.list"
            :key="item.id"
            {{
            item.name
            }}
          ></li>

          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Rose - ₱20
            <span class="badge text-bg-secondary rounded-pill">14</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Rose - ₱20
            <span class="badge text-bg-secondary rounded-pill">2</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
          >
            Rose - ₱20
            <span class="badge text-bg-secondary rounded-pill">1</span>
          </li>
          <li
            class="list-group-item d-flex justify-content-end align-items-center fw-bold"
          >
            <span class="badge text-bg-success">Total: P300</span>

            <!-- example only -->
          </li>
          <li
            class="list-group-item d-flex justify-content-end align-items-center fw-bold"
          >
            <span class="badge text-bg-danger">Tax: P10</span>
          </li>
        </ul>
      </div>

      <div class="col">
        <div class="row"><Categories /><Items /></div>
      </div>
    </div>
  </div>
  <PosBottomBar />
</template>

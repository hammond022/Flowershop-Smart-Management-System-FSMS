<script setup>
import OrderService from "@/router/api/ordersService";
import ItemService from "@/router/api/itemsService";
import { computed, onMounted, ref } from "vue";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();

const orders = ref([]);
const items = ref([]);

async function getOrders() {
  try {
    const drafts = await OrderService.getOrders();
    orders.value = drafts;
  } catch (err) {
    showToast("error", err.response?.data?.error || "Failed to load orders");
  }
}

const completedOrders = computed(() =>
  orders.value.filter(
    (order) => order.orderStatus?.toLowerCase() === "completed"
  )
);

const draftOrders = computed(() =>
  orders.value.filter((order) => order.orderStatus?.toLowerCase() === "draft")
);

const pendingOrders = computed(() =>
  orders.value.filter((order) => order.orderStatus?.toLowerCase() === "pending")
);

const firstFiveOrders = computed(() =>
  orders.value
    .filter((o) => o.orderStatus?.toLowerCase() !== "draft")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
);

async function getItems() {
  try {
    items.value = await ItemService.getItems();
  } catch (err) {
    console.error("Failed to load items:", err);
  }
}

const lowStockCount = computed(
  () => items.value.filter((item) => item.stock <= 5).length
);

const categoryCounts = computed(() => {
  const counts = {};
  items.value.forEach((item) => {
    if (!counts[item.category]) counts[item.category] = 0;
    counts[item.category]++;
  });
  return counts;
});

onMounted(() => {
  getOrders();
  getItems();
});
</script>

<template>
  <div class="container my-4">
    <div class="d-flex align-items-center p-3 mb-5 bg-light rounded shadow-sm">
      <img
        src="../../assets/icons/user.svg"
        height="75"
        width="75"
        class="rounded-circle me-3"
        alt="User Avatar"
      />
      <div>
        <h3 class="mb-0">Good Morning, John Doe</h3>
        <p class="text-muted mb-0">Admin</p>
      </div>
    </div>

    <h1 class="mb-5">Dashboard</h1>

    <div class="row row-cols-1 row-cols-md-3 g-4 text-center">
      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <i class="bi bi-check-circle fs-2 text-success mb-2"></i>
            <h5 class="card-title">Completed</h5>
            <p class="fs-4 fw-bold">{{ completedOrders.length }}</p>
            <span class="badge bg-success mb-2">Success</span>
            <div class="progress mt-2" style="height: 6px">
              <div
                class="progress-bar bg-success"
                :style="{
                  width:
                    ((completedOrders.length / orders.length) * 100 || 0) + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <i class="bi bi-pencil-square fs-2 text-warning mb-2"></i>
            <h5 class="card-title">Drafts</h5>
            <p class="fs-4 fw-bold">{{ draftOrders.length }}</p>
            <span class="badge bg-warning mb-2">In Progress</span>
            <div class="progress mt-2" style="height: 6px">
              <div
                class="progress-bar bg-warning"
                :style="{
                  width:
                    ((draftOrders.length / orders.length) * 100 || 0) + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="col">
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <i class="bi bi-clock fs-2 text-danger mb-2"></i>
            <h5 class="card-title">Pending Payment</h5>
            <p class="fs-4 fw-bold">{{ pendingOrders.length }}</p>
            <span class="badge bg-danger mb-2">Attention</span>
            <div class="progress mt-2" style="height: 6px">
              <div
                class="progress-bar bg-danger"
                :style="{
                  width:
                    ((pendingOrders.length / orders.length) * 100 || 0) + '%',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mb-3 mt-3">
      <div class="card-body">
        <h5 class="card-title mb-4">
          <i class="bi bi-box-seam fs-2 me-2"></i>
          Product Details
        </h5>

        <div class="list-group list-group-flush">
          <div
            class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
          >
            Low Stock Items
            <span class="badge bg-danger rounded-pill">{{
              lowStockCount
            }}</span>
          </div>

          <div
            v-for="(count, category) in categoryCounts"
            :key="category"
            class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2 text-capitalize"
          >
            All {{ category }}
            <span class="badge bg-primary rounded-pill">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm border-0 mt-3">
      <div class="card-body">
        <h5 class="card-title mb-4">
          <i class="bi bi-receipt fs-2 me-2"></i>
          Previous Transactions
        </h5>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col">Mode of Payment</th>
                <th scope="col">No. of Items</th>
                <th scope="col">Status</th>
                <th scope="col">Price</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in firstFiveOrders" :key="order.id">
                <td>
                  {{
                    order.mop
                      ? order.mop.charAt(0).toUpperCase() + order.mop.slice(1)
                      : "—"
                  }}
                </td>

                <td>
                  {{
                    order.selectedFlowers?.reduce(
                      (total, f) => total + (f.qty || 0),
                      0
                    ) || 0
                  }}
                </td>

                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success':
                        order.orderStatus?.toLowerCase() === 'completed',
                      'bg-warning text-dark':
                        order.orderStatus?.toLowerCase() === 'pending',
                      'bg-danger':
                        order.orderStatus?.toLowerCase() === 'cancelled',
                    }"
                  >
                    {{ order.orderStatus }}
                  </span>
                </td>

                <td>
                  {{
                    new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(
                      (order.selectedFlowers?.reduce(
                        (sum, f) => sum + f.price * (f.qty || 0),
                        0
                      ) || 0) -
                        (order.discounts?.reduce(
                          (sum, d) => sum + d.value,
                          0
                        ) || 0)
                    )
                  }}
                </td>

                <td>{{ new Date(order.createdAt).toLocaleDateString() }}</td>
              </tr>

              <tr v-if="firstFiveOrders.length === 0">
                <td colspan="5" class="text-center text-muted py-3">
                  No transactions available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px); /* slides up smoothly */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* smooth shadow increase */
}
</style> -->

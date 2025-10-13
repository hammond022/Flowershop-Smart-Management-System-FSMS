<script setup>
import { ref, computed, onMounted } from "vue";
import ApexCharts from "vue3-apexcharts";
import OrderService from "@/router/api/ordersService";
import { useToast } from "@/composables/useToast";

const { showToast } = useToast();
const orders = ref([]);
const selectedRange = ref("daily");

async function getOrders() {
  try {
    const allOrders = await OrderService.getOrders();
    orders.value = allOrders.filter(
      (o) => o.orderStatus.toLowerCase() === "completed"
    );
  } catch (err) {
    showToast("error", err.response?.data?.error || "Failed to load orders");
  }
}

const salesData = computed(() => {
  const counts = {};

  orders.value.forEach((order) => {
    const date = new Date(order.orderEnd);
    let key = "";

    if (selectedRange.value === "daily") {
      key = date.toISOString().slice(0, 10);
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    }

    const subtotal =
      order.selectedFlowers?.reduce(
        (sum, f) => sum + f.price * (f.qty || 0),
        0
      ) || 0;
    const discount =
      order.discounts?.reduce(
        (sum, d) =>
          d.type === "percent"
            ? sum + subtotal * (d.value / 100)
            : sum + d.value,
        0
      ) || 0;

    counts[key] = (counts[key] || 0) + (subtotal - discount);
  });

  const labels = Object.keys(counts).sort();
  const data = labels.map((label) => counts[label]);

  return { labels, data };
});

const chartOptions = computed(() => ({
  chart: { id: "sales-histogram", toolbar: { show: true } },
  xaxis: { categories: salesData.value.labels },
  yaxis: { title: { text: "Sales (PHP)" } },
  dataLabels: { enabled: true, formatter: (val) => `₱${val.toLocaleString()}` },
  title: {
    text: `Sales per ${selectedRange.value === "daily" ? "Day" : "Month"}`,
    align: "center",
  },
  tooltip: { y: { formatter: (val) => `₱${val.toLocaleString()}` } },
}));

const chartSeries = computed(() => [
  { name: "Sales", data: salesData.value.data },
]);

onMounted(() => {
  getOrders();
});
</script>

<template>
  <div class="my-4">
    <h1 class="mb-4">Sales Histogram</h1>

    <div class="mb-3 d-flex align-items-center gap-3">
      <label class="form-label mb-0">View By:</label>
      <select class="form-select w-auto" v-model="selectedRange">
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
      </select>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <ApexCharts
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
          height="400"
        />
      </div>
    </div>
  </div>
</template>

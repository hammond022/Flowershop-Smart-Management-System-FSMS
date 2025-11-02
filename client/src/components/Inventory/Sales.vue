<script setup>
import { ref, computed, onMounted } from "vue";
import ApexCharts from "vue3-apexcharts";
import OrderService from "@/router/api/ordersService";
import { useToast } from "@/composables/useToast";
import { Modal } from "bootstrap";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const { showToast } = useToast();
const orders = ref([]);
const selectedRange = ref("daily");
const selectedTransaction = ref(null);

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
  dataLabels: { enabled: true, formatter: (val) => "P" + val.toLocaleString() },
  title: {
    text: `Sales per ${selectedRange.value === "daily" ? "Day" : "Month"}`,
    align: "center",
  },
  tooltip: { y: { formatter: (val) => "P" + val.toLocaleString() } },
}));

const chartSeries = computed(() => [
  { name: "Sales", data: salesData.value.data },
]);

const getTodayOrders = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return orders.value.filter(
    (order) => new Date(order.orderEnd).toISOString().slice(0, 10) === today
  );
});

function getTotal(order) {
  const subtotal =
    order.selectedFlowers?.reduce(
      (sum, f) => sum + f.price * (f.qty || 0),
      0
    ) || 0;

  const discount =
    order.discounts?.reduce((sum, d) => {
      if (d.type === "percent") return sum + subtotal * (d.value / 100);
      return sum + d.value;
    }, 0) || 0;

  return subtotal - discount;
}

function isRecent(tx) {
  const diffHours = (new Date() - new Date(tx.orderEnd)) / (1000 * 60 * 60);
  return diffHours <= 24;
}

function openModal(tx) {
  selectedTransaction.value = tx;
  const modalEl = document.getElementById("transactionModal");
  const modal = new Modal(modalEl);
  modal.show();
}

const generateSalesSummary = () => {
  const todayOrders = getTodayOrders.value;

  // Calculate total sales and payment methods breakdown
  let totalSales = 0;
  const paymentMethods = {};
  const productSales = {};

  todayOrders.forEach((order) => {
    // Calculate total for this order
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
    const total = subtotal - discount;

    totalSales += total;

    // Track payment methods
    const paymentMethod = order.paymentMethod || "Unknown";
    paymentMethods[paymentMethod] =
      (paymentMethods[paymentMethod] || 0) + total;

    // Track product sales
    order.selectedFlowers?.forEach((flower) => {
      if (!productSales[flower.name]) {
        productSales[flower.name] = { quantity: 0, revenue: 0 };
      }
      productSales[flower.name].quantity += flower.qty || 0;
      productSales[flower.name].revenue += flower.price * (flower.qty || 0);
    });
  });

  // Sort products by revenue
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue,
    }));

  return {
    date: new Date().toLocaleDateString(),
    totalTransactions: todayOrders.length,
    totalSales,
    paymentMethods,
    topProducts,
  };
};

const downloadPDF = () => {
  const summary = generateSalesSummary();
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Daily Sales Summary", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Date: ${summary.date}`, 105, 25, { align: "center" });

  // General Statistics
  doc.setFontSize(14);
  doc.text("Summary", 14, 40);
  autoTable(doc, {
    startY: 45,
    head: [["Metric", "Value"]],
    body: [
      ["Total Transactions", summary.totalTransactions],
      ["Total Sales", "P" + summary.totalSales.toLocaleString()],
    ],
  });

  // Payment Methods
  doc.text("Payment Methods", 14, doc.lastAutoTable.finalY + 15);
  const paymentMethodsData = Object.entries(summary.paymentMethods).map(
    ([method, amount]) => [method, "P" + amount.toLocaleString()]
  );
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Method", "Amount"]],
    body: paymentMethodsData,
  });

  // Top Products
  doc.text("Top 5 Products", 14, doc.lastAutoTable.finalY + 15);
  const productsData = summary.topProducts.map((product) => [
    product.name,
    product.quantity,
    "P" + product.revenue.toLocaleString(),
  ]);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Product", "Quantity", "Revenue"]],
    body: productsData,
  });

  // Transactions Table
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Today's Transactions", 14, 20);

  const transactionsData = getTodayOrders.value.map((tx) => [
    tx.id,
    tx.mop ? tx.mop.charAt(0).toUpperCase() + tx.mop.slice(1) : "—",
    tx.selectedFlowers?.reduce((sum, f) => sum + (f.qty || 0), 0) || 0,
    tx.orderStatus,
    "P" + getTotal(tx).toLocaleString(),
    new Date(tx.orderStart).toLocaleString(),
    new Date(tx.orderEnd).toLocaleString(),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["ID", "Payment", "Items", "Status", "Total", "Start", "End"]],
    body: transactionsData,
    styles: { fontSize: 8 },
    columnStyles: {
      5: { cellWidth: 40 },
      6: { cellWidth: 40 },
    },
  });

  doc.save(`sales-summary-${new Date().toISOString().slice(0, 10)}.pdf`);
};

const downloadExcel = async () => {
  const summary = generateSalesSummary();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Summary");

  // Title
  worksheet.mergeCells("A1:C1");
  worksheet.getCell("A1").value = "Daily Sales Summary";
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { size: 16, bold: true };

  // Date
  worksheet.mergeCells("A2:C2");
  worksheet.getCell("A2").value = `Date: ${summary.date}`;
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  // General Statistics
  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(["Summary"]).font = { bold: true };
  worksheet.addRow(["Total Transactions", summary.totalTransactions]);
  worksheet.addRow(["Total Sales", "P" + summary.totalSales.toLocaleString()]);

  // Payment Methods
  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(["Payment Methods"]).font = { bold: true };
  worksheet.addRow(["Method", "Amount"]).font = { bold: true };
  Object.entries(summary.paymentMethods).forEach(([method, amount]) => {
    worksheet.addRow([method, "P" + amount.toLocaleString()]);
  });

  // Top Products
  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(["Top 5 Products"]).font = { bold: true };
  worksheet.addRow(["Product", "Quantity", "Revenue"]).font = { bold: true };
  summary.topProducts.forEach((product) => {
    worksheet.addRow([
      product.name,
      product.quantity,
      `₱${product.revenue.toLocaleString()}`,
    ]);
  });

  // Transactions
  worksheet.addRow([]); // Empty row for spacing
  worksheet.addRow(["Today's Transactions"]).font = { bold: true, size: 14 };
  worksheet.addRow([
    "ID",
    "Payment",
    "Items",
    "Status",
    "Total",
    "Start",
    "End",
  ]).font = { bold: true };

  getTodayOrders.value.forEach((tx) => {
    worksheet.addRow([
      tx.id,
      tx.mop ? tx.mop.charAt(0).toUpperCase() + tx.mop.slice(1) : "—",
      tx.selectedFlowers?.reduce((sum, f) => sum + (f.qty || 0), 0) || 0,
      tx.orderStatus,
      "P" + getTotal(tx).toLocaleString(),
      new Date(tx.orderStart).toLocaleString(),
      new Date(tx.orderEnd).toLocaleString(),
    ]);
  });

  // Auto-fit columns
  worksheet.columns.forEach((column, index) => {
    column.width = index === 5 || index === 6 ? 25 : 15; // Make date columns wider
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]),
    `sales-summary-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};

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

      <div class="ms-auto">
        <button class="btn btn-outline-primary me-2" @click="downloadPDF">
          <i class="bi bi-file-pdf"></i> Save as PDF
        </button>
        <button class="btn btn-outline-success" @click="downloadExcel">
          <i class="bi bi-file-excel"></i> Save as Excel
        </button>
      </div>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <ApexCharts
          type="bar"
          :options="chartOptions"
          :series="chartSeries"
          height="400"
        />
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card shadow-sm">
      <div class="card-body">
        <h3 class="mb-4">Today's Transactions</h3>
        <div class="table-responsive">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Payment</th>
                <th>Items</th>
                <th>Status</th>
                <th>Total</th>
                <th>Start</th>
                <th>End</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tx in getTodayOrders"
                :key="tx.id"
                :class="{
                  'table-success': getTotal(tx) > 1000,
                  'table-info': isRecent(tx),
                }"
              >
                <td>{{ tx.id }}</td>
                <td>
                  {{
                    tx.mop
                      ? tx.mop.charAt(0).toUpperCase() + tx.mop.slice(1)
                      : "—"
                  }}
                </td>
                <td>
                  {{
                    tx.selectedFlowers?.reduce(
                      (sum, f) => sum + (f.qty || 0),
                      0
                    ) || 0
                  }}
                </td>
                <td>
                  <span
                    class="badge"
                    :class="{
                      'bg-success':
                        tx.orderStatus?.toLowerCase() === 'completed',
                      'bg-warning text-dark':
                        tx.orderStatus?.toLowerCase() === 'pending',
                      'bg-danger':
                        tx.orderStatus?.toLowerCase() === 'cancelled',
                    }"
                  >
                    {{ tx.orderStatus }}
                  </span>
                </td>
                <td>
                  {{
                    new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                    }).format(getTotal(tx))
                  }}
                </td>
                <td>{{ new Date(tx.orderStart).toLocaleString() }}</td>
                <td>{{ new Date(tx.orderEnd).toLocaleString() }}</td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" @click="openModal(tx)">
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="getTodayOrders.length === 0">
                <td colspan="7" class="text-center text-muted py-3">
                  No transactions found for today.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Transaction Details Modal -->
    <div id="transactionModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" v-if="selectedTransaction">
          <div class="modal-header">
            <h5 class="modal-title">Transaction Details</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Order Start:</strong>
              {{ new Date(selectedTransaction.orderStart).toLocaleString() }}
            </p>
            <p>
              <strong>Order End:</strong>
              {{ new Date(selectedTransaction.orderEnd).toLocaleString() }}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                class="badge"
                :class="{
                  'bg-success':
                    selectedTransaction.orderStatus?.toLowerCase() === 'completed',
                  'bg-warning text-dark':
                    selectedTransaction.orderStatus?.toLowerCase() === 'pending',
                  'bg-danger':
                    selectedTransaction.orderStatus?.toLowerCase() === 'cancelled',
                }"
              >
                {{ selectedTransaction.orderStatus }}
              </span>
            </p>

            <div class="accordion" id="transactionAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#itemsCollapse"
                    aria-expanded="true"
                  >
                    Items
                  </button>
                </h2>
                <div
                  id="itemsCollapse"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#transactionAccordion"
                >
                  <div class="accordion-body">
                    <ul class="list-group list-group-flush">
                      <li
                        v-for="item in selectedTransaction.selectedFlowers"
                        :key="item.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {{ item.qty }}x {{ item.name }}
                        <span>{{
                          new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(item.price * (item.qty || 0))
                        }}</span>
                      </li>

                      <li
                        v-if="selectedTransaction.discounts?.length > 0"
                        class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                      >
                        Discount Total:
                        <span class="badge bg-primary">
                          {{
                            selectedTransaction.discounts.reduce((sum, d) => {
                              if (d.type === "percent")
                                return sum + getTotal(selectedTransaction) * (d.value / 100);
                              return sum + d.value;
                            }, 0)
                          }}
                        </span>
                      </li>

                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                      >
                        Total:
                        <span>{{
                          new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(getTotal(selectedTransaction))
                        }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

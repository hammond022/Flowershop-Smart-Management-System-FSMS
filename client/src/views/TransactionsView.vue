<script setup>
import OrderService from "@/router/api/ordersService";
import { watch, ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "@/composables/useToast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter, useRoute } from "vue-router";
import { nextTick } from "vue";
import { useClock } from "@/composables/useClock";

const { now } = useClock();
const router = useRouter();
const route = useRoute();

const previousRoute = ref(null);
const showGoBack = computed(() => !!route.query.txId);

const { showToast } = useToast();
const transactions = ref([]);
const filteredTransactions = ref([]);
const selectedTransaction = ref(null);

const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = computed(() =>
  Math.ceil(filteredTransactions.value.length / pageSize.value)
);

const searchQuery = ref("");
const statusFilter = ref(route.query.status || "");
const paymentFilter = ref("");
const startDate = ref("");
const endDate = ref("");
const refId = ref("");

async function completeTransaction(orderId) {
  try {
    const updatedOrder = await OrderService.updateOrder(orderId, {
      orderStatus: "Completed",
      orderEnd: new Date().toISOString(),
      refId: refId.value,
    });
    showToast("success", `Order updated successfully`);
    console.log("Order updated successfully:", updatedOrder);
  } catch (err) {
    showToast("error", err.response?.data.error);
    console.error("Failed to update order:", err);
  } finally {
    getTransactions();
    const modalEl = document.getElementById("resolveTransactionModal");
    const modalInstance = Modal.getInstance(modalEl);
    modalInstance.hide();
  }
}

async function cancelTransaction(orderId) {
  try {
    const updatedOrder = await OrderService.updateOrder(orderId, {
      orderStatus: "Cancelled",
    });
    showToast("success", `Transaction cancelled successfully`);
    console.log("Transaction cancelled successfully:", updatedOrder);
  } catch (err) {
    showToast("error", err.response?.data.error);
    console.error("Failed to cancel transaction:", err);
  } finally {
    getTransactions();
    const modalEl = document.getElementById("resolveTransactionModal");
    const modalInstance = Modal.getInstance(modalEl);
    modalInstance.hide();
  }
}

async function getTransactions() {
  try {
    const allOrders = await OrderService.getOrders();
    transactions.value = allOrders.filter(
      (o) => o.orderStatus?.toLowerCase() !== "draft"
    );
    applyFilters();
  } catch (err) {
    showToast(
      "error",
      err.response?.data?.error || "Failed to load transactions"
    );
  }
}

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

function displayStatus(s) {
  const st = (s || "").toString();
  if (!st) return "";
  const lower = st.toLowerCase();
  if (lower.includes("void") || lower.includes("cancel")) return "Cancelled";
  if (lower.includes("complete")) return "Completed";
  if (lower.includes("pending")) return "Pending";
  return st.charAt(0).toUpperCase() + st.slice(1).toLowerCase();
}

function openModal(tx) {
  selectedTransaction.value = tx;
  const modalEl = document.getElementById("transactionModal");
  const modal = new Modal(modalEl);
  modal.show();
}

function applyFilters() {
  filteredTransactions.value = transactions.value
    .filter((tx) => {
      const matchesSearch =
        !searchQuery.value || tx.id.toString().includes(searchQuery.value);

      function normalizeStatus(s) {
        const st = (s || "").toString().toLowerCase();
        if (!st) return "";
        if (st.includes("void") || st.includes("cancel")) return "cancelled";
        if (st.includes("complete")) return "completed";
        if (st.includes("pending")) return "pending";
        if (st.includes("draft")) return "draft";
        return st;
      }

      const matchesStatus = (() => {
        if (!statusFilter.value) return true;
        const filter = statusFilter.value.toLowerCase();
        const status = normalizeStatus(tx.orderStatus);
        return status === filter;
      })();

      const matchesPayment =
        !paymentFilter.value ||
        (tx.mop && tx.mop.toLowerCase() === paymentFilter.value);

      const matchesDate =
        (!startDate.value ||
          new Date(tx.orderStart) >= new Date(startDate.value)) &&
        (!endDate.value || new Date(tx.orderEnd) <= new Date(endDate.value));

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    })
    .sort((a, b) => new Date(b.orderEnd) - new Date(a.orderEnd)); // Sort by orderEnd date, newest first

  currentPage.value = 1;
}

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredTransactions.value.slice(start, start + pageSize.value);
});

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function isHighValue(tx) {
  return getTotal(tx) > 1000;
}

function isRecent(tx) {
  const diffHours = (new Date() - new Date(tx.orderEnd)) / (1000 * 60 * 60);
  return diffHours <= 24;
}

const printTransaction = (tx) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Transaction Receipt", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Transaction ID: ${tx.id}`, 105, 25, { align: "center" });

  doc.setFontSize(14);
  doc.text("Transaction Details", 14, 40);
  autoTable(doc, {
    startY: 45,
    head: [["Field", "Value"]],
    body: [
      ["Status", displayStatus(tx.orderStatus)],
      [
        "Payment Method",
        tx.mop ? tx.mop.charAt(0).toUpperCase() + tx.mop.slice(1) : "—",
      ],
      ["Start Time", new Date(tx.orderStart).toLocaleString()],
      ["End Time", new Date(tx.orderEnd).toLocaleString()],
      ["Amount Paid", `PHP ${(Number(tx.amountPaid) || 0).toFixed(2)}`],
      ["Change", `PHP ${(Number(tx.change) || 0).toFixed(2)}`],
    ],
  });

  doc.text("Items", 14, doc.lastAutoTable.finalY + 15);
  const itemsData =
    tx.selectedFlowers?.map((item) => [
      item.name,
      item.qty,
      `PHP ${(Number(item.price) || 0).toFixed(2)}`,
      `PHP ${((Number(item.price) || 0) * (item.qty || 0) || 0).toFixed(2)}`,
    ]) || [];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Item", "Quantity", "Unit Price", "Total"]],
    body: itemsData,
  });

  if (tx.discounts?.length > 0) {
    doc.text("Discounts", 14, doc.lastAutoTable.finalY + 15);
    const discountsData = tx.discounts.map((discount) => [
      discount.type === "percent" ? "Percentage" : "Fixed Amount",
      discount.type === "percent"
        ? `${discount.value}%`
        : `PHP ${discount.value}`,
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [["Type", "Value"]],
      body: discountsData,
    });
  }

  doc.text("Summary", 14, doc.lastAutoTable.finalY + 15);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    body: [
      [
        "Subtotal",
        `PHP ${(
          tx.selectedFlowers?.reduce(
            (sum, f) => sum + f.price * (f.qty || 0),
            0
          ) || 0
        ).toFixed(2)}`,
      ],
      [
        "Discount",
        `PHP ${(
          tx.discounts?.reduce((sum, d) => {
            const subtotal =
              tx.selectedFlowers?.reduce(
                (sum, f) => sum + f.price * (f.qty || 0),
                0
              ) || 0;
            if (d.type === "percent") return sum + subtotal * (d.value / 100);
            return sum + d.value;
          }, 0) || 0
        ).toFixed(2)}`,
      ],
      ["Total", `PHP ${(getTotal(tx) || 0).toFixed(2)}`],
    ],
  });

  if (tx.dedicationMessage) {
    doc.text("Customer Notes", 14, doc.lastAutoTable.finalY + 15);
    doc.setFontSize(12);
    doc.text(tx.dedicationMessage, 14, doc.lastAutoTable.finalY + 25, {
      maxWidth: 180,
    });
    doc.setFontSize(14);
  }

  if (tx.customerName) {
    doc.text("Customer Information", 14, doc.lastAutoTable.finalY + 35);
    doc.setFontSize(12);
    doc.text(`Name: ${tx.customerName}`, 14, doc.lastAutoTable.finalY + 45);
    doc.text(
      `Contact: ${tx.customerContact || "—"}`,
      14,
      doc.lastAutoTable.finalY + 55
    );
    doc.setFontSize(14);
  }

  doc.save(`transaction-${tx.id}-${new Date().toISOString().slice(0, 10)}.pdf`);
};

watch(
  () => route.query.txId,
  async (txId) => {
    if (txId) {
      if (!transactions.value.length) await getTransactions();

      const tx = transactions.value.find((t) => t.id.toString() === txId);
      if (tx) openModal(tx);
    }
  },
  { immediate: true }
);

function goBack() {
  const modalEl = document.getElementById("transactionModal");
  const modalInstance = Modal.getInstance(modalEl);

  if (modalInstance) {
    modalInstance.hide();
  }

  const txId = route.query.txId;

  const navigateAndScroll = async (targetRoute) => {
    await router.push(targetRoute);
    await nextTick(); // wait for DOM update
    if (txId) {
      const rowEl = document.getElementById("tx-" + txId);
      if (rowEl) rowEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (previousRoute.value) {
    navigateAndScroll(previousRoute.value);
  } else {
    navigateAndScroll({ name: "overview" });
  }
}

onMounted(() => {
  getTransactions();

  if (window.history.state && window.history.state.back) {
    previousRoute.value = window.history.state.back;

    showGoBack.value = previousRoute.value.name !== "transactions";
  } else {
    showGoBack.value = false;
  }

  const txId = route.query.txId;
  if (txId) {
    const tx = transactions.value.find((t) => t.id.toString() === txId);
    if (tx) openModal(tx);
  }
});
</script>

<template>
  <div class="container my-4 border rounded shadow-lg p-3">
    <h1 class="mb-4">Transactions</h1>
    <div class="row g-3 mb-3">
      <div class="col-md-3">
        <input
          type="text"
          class="form-control"
          placeholder="Search by ID"
          v-model="searchQuery"
          @input="applyFilters"
        />
      </div>
      <div class="col-md-2">
        <select
          class="form-select"
          v-model="statusFilter"
          @change="applyFilters"
        >
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="col-md-2">
        <select
          class="form-select"
          v-model="paymentFilter"
          @change="applyFilters"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="bank">E-Wallet</option>
        </select>
      </div>
      <div class="col-md-2">
        <input
          type="date"
          class="form-control"
          v-model="startDate"
          @change="applyFilters"
        />
      </div>
      <div class="col-md-2">
        <input
          type="date"
          class="form-control"
          v-model="endDate"
          @change="applyFilters"
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Payment</th>
            <th>Amount Paid</th>
            <th>Change</th>
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
            v-for="tx in paginatedTransactions"
            :key="tx.id"
            :class="{
              'table-success': isHighValue(tx),
              'table-info': isRecent(tx),
            }"
          >
            <td>{{ tx.id }}</td>
            <td>
              {{
                tx.mop ? tx.mop.charAt(0).toUpperCase() + tx.mop.slice(1) : "—"
              }}
            </td>
            <td>PHP {{ (Number(tx.amountPaid) || 0).toFixed(2) }}</td>
            <td>PHP {{ (Number(tx.change) || 0).toFixed(2) }}</td>
            <td>
              {{
                tx.selectedFlowers?.reduce((sum, f) => sum + (f.qty || 0), 0) ||
                0
              }}
            </td>
            <td>
              <span
                class="badge"
                :class="{
                  'bg-success': (tx.orderStatus || '')
                    .toString()
                    .toLowerCase()
                    .includes('complete'),
                  'bg-warning text-dark': (tx.orderStatus || '')
                    .toString()
                    .toLowerCase()
                    .includes('pending'),
                  'bg-danger':
                    (tx.orderStatus || '')
                      .toString()
                      .toLowerCase()
                      .includes('cancel') ||
                    (tx.orderStatus || '')
                      .toString()
                      .toLowerCase()
                      .includes('void'),
                }"
              >
                {{ displayStatus(tx.orderStatus) }}
              </span>
            </td>
            <td>PHP {{ (getTotal(tx) || 0).toFixed(2) }}</td>
            <td>{{ new Date(tx.orderStart).toLocaleString() }}</td>
            <td>{{ new Date(tx.orderEnd).toLocaleString() }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary"
                @click="openModal(tx)"
              >
                View
              </button>
            </td>
          </tr>

          <tr v-if="filteredTransactions.length === 0">
            <td colspan="8" class="text-center text-muted py-3">
              No transactions found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav aria-label="Transaction pagination">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Previous</button>
        </li>
        <li class="page-item disabled">
          <span class="page-link">{{ currentPage }} / {{ totalPages }}</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>

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
            <div
              class="alert alert-warning"
              role="alert"
              v-if="
                (selectedTransaction.orderStatus || '')
                  .toString()
                  .toLowerCase()
                  .includes('pending')
              "
            >
              Pending payment through Bank Transfer/E-Wallet.
            </div>
            <p>
              <strong>Order Start:</strong>
              {{ new Date(selectedTransaction.orderStart).toLocaleString() }}
            </p>
            <p>
              <strong>Order End:</strong>
              {{ new Date(selectedTransaction.orderEnd).toLocaleString() }}
            </p>
            <p>
              <strong>Customer Name:</strong>
              {{ selectedTransaction.customerName }}
            </p>
            <p>
              <strong>Contact No. :</strong>
              {{ selectedTransaction.customerContact }}
            </p>
            <p>
              <strong>Status: </strong>
              <span
                class="badge"
                :class="{
                  'bg-success': (selectedTransaction.orderStatus || '')
                    .toString()
                    .toLowerCase()
                    .includes('complete'),
                  'bg-warning text-dark': (
                    selectedTransaction.orderStatus || ''
                  )
                    .toString()
                    .toLowerCase()
                    .includes('pending'),
                  'bg-danger':
                    (selectedTransaction.orderStatus || '')
                      .toString()
                      .toLowerCase()
                      .includes('cancel') ||
                    (selectedTransaction.orderStatus || '')
                      .toString()
                      .toLowerCase()
                      .includes('void'),
                }"
              >
                {{ displayStatus(selectedTransaction.orderStatus) }}
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
                        <div>
                          <i
                            class="text-primary ms-1 inline bi bi-sticky"
                            v-tooltip="item.notes"
                            v-if="item.notes"
                          ></i>
                          {{ item.qty }}x {{ item.name }}
                          <span>
                            PHP
                            {{
                              (
                                (Number(item.price) || 0) * (item.qty || 0) || 0
                              ).toFixed(2)
                            }}
                          </span>
                        </div>
                      </li>

                      <li
                        v-if="selectedTransaction.discounts?.length > 0"
                        class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                      >
                        Discount Total:
                        <span class="badge bg-primary">
                          PHP
                          {{
                            (
                              selectedTransaction.discounts.reduce((sum, d) => {
                                if (d.type === "percent")
                                  return (
                                    sum +
                                    getTotal(selectedTransaction) *
                                      (d.value / 100)
                                  );
                                return sum + d.value;
                              }, 0) || 0
                            ).toFixed(2)
                          }}
                        </span>
                      </li>

                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                      >
                        Total:
                        <span
                          >PHP
                          {{
                            (getTotal(selectedTransaction) || 0).toFixed(2)
                          }}</span
                        >
                      </li>
                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-light"
                      >
                        Amount Paid:
                        <span
                          >PHP
                          {{
                            (
                              Number(selectedTransaction.amountPaid) || 0
                            ).toFixed(2)
                          }}</span
                        >
                      </li>
                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-warning"
                      >
                        Change:
                        <span
                          >PHP
                          {{
                            (Number(selectedTransaction.change) || 0).toFixed(2)
                          }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedTransaction?.dedicationMessage" class="mt-3">
              <h6>Customer Notes:</h6>
              <p class="fst-italic">
                {{ selectedTransaction.dedicationMessage }}
              </p>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button
              v-if="showGoBack"
              type="button"
              class="btn btn-outline-secondary"
              @click="goBack"
            >
              <i class="bi bi-arrow-left"></i> Go Back
            </button>

            <button
              v-if="
                selectedTransaction.mop !== 'cash' &&
                (selectedTransaction.orderStatus || '')
                  .toString()
                  .toLowerCase()
                  .includes('pending')
              "
              type="button"
              class="btn btn-warning"
              data-bs-toggle="modal"
              data-bs-target="#resolveTransactionModal"
            >
              Resolve
            </button>

            <div class="ms-auto">
              <button
                type="button"
                class="btn btn-outline-primary me-2"
                @click="printTransaction(selectedTransaction)"
              >
                <i class="bi bi-file-pdf"></i> Print Receipt
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="resolveTransactionModal" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content" v-if="selectedTransaction">
          <div class="modal-header">
            <h5 class="modal-title">Resolve Transaction Modal</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning" role="alert">
              Resolve by providing payment reference number.
            </div>
            <div class="form-floating mt-3 mb-3">
              <input
                v-model="refId"
                type="text"
                class="form-control"
                id="floatingInput"
                placeholder="John Doe"
              />
              <label for="floatingInput">Reference no.</label>
            </div>
            <p>
              <strong>Order Start:</strong>
              {{ new Date(selectedTransaction.orderStart).toLocaleString() }}
            </p>
            <p>
              <strong>Order End:</strong>
              {{
                now.toLocaleString("en-US", {
                  dateStyle: "short",
                  timeStyle: "medium",
                })
              }}
            </p>
            <p>
              <strong>Customer Name:</strong>
              {{ selectedTransaction.customerName }}
            </p>
            <p>
              <strong>Contact No. :</strong>
              {{ selectedTransaction.customerContact }}
            </p>
            <div class="accordion" id="transactionAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#itemsCollapse"
                  >
                    Items
                  </button>
                </h2>
                <div
                  id="itemsCollapse"
                  class="accordion-collapse collapse"
                  data-bs-parent="#transactionAccordion"
                >
                  <div class="accordion-body">
                    <ul class="list-group list-group-flush">
                      <li
                        v-for="item in selectedTransaction.selectedFlowers"
                        :key="item.id"
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <i
                            class="text-primary ms-1 inline bi bi-sticky"
                            v-tooltip="item.notes"
                            v-if="item.notes"
                          ></i>
                          {{ item.qty }}x {{ item.name }}
                          <span>
                            PHP
                            {{
                              (
                                (Number(item.price) || 0) * (item.qty || 0) || 0
                              ).toFixed(2)
                            }}
                          </span>
                        </div>
                      </li>

                      <li
                        v-if="selectedTransaction.discounts?.length > 0"
                        class="list-group-item d-flex justify-content-between align-items-center fw-bold"
                      >
                        Discount Total:
                        <span class="badge bg-primary">
                          PHP
                          {{
                            (
                              selectedTransaction.discounts.reduce((sum, d) => {
                                if (d.type === "percent")
                                  return (
                                    sum +
                                    getTotal(selectedTransaction) *
                                      (d.value / 100)
                                  );
                                return sum + d.value;
                              }, 0) || 0
                            ).toFixed(2)
                          }}
                        </span>
                      </li>

                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
                      >
                        Total:
                        <span
                          >PHP
                          {{
                            (getTotal(selectedTransaction) || 0).toFixed(2)
                          }}</span
                        >
                      </li>
                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-light"
                      >
                        Amount Paid:
                        <span
                          >PHP
                          {{
                            (
                              Number(selectedTransaction.amountPaid) || 0
                            ).toFixed(2)
                          }}</span
                        >
                      </li>
                      <li
                        class="list-group-item d-flex justify-content-between align-items-center list-group-item-warning"
                      >
                        Change:
                        <span
                          >PHP
                          {{
                            (Number(selectedTransaction.change) || 0).toFixed(2)
                          }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedTransaction?.dedicationMessage" class="mt-3">
              <h6>Customer Notes:</h6>
              <p class="fst-italic">
                {{ selectedTransaction.dedicationMessage }}
              </p>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#transactionModal"
            >
              <i class="bi bi-arrow-left"></i> Go Back
            </button>

            <div class="ms-auto">
              <button
                type="button"
                class="btn btn-secondary me-2"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-danger me-2"
                @click="cancelTransaction(selectedTransaction.id)"
                :disabled="
                  !['pending'].includes(
                    (selectedTransaction.orderStatus || '').toLowerCase()
                  )
                "
              >
                Cancel transaction
              </button>
              <button
                type="button"
                class="btn btn-success"
                @click="completeTransaction(selectedTransaction.id)"
                :disabled="!refId"
              >
                Complete transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

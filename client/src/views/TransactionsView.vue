<script setup>
import OrderService from "@/router/api/ordersService";
import { ref, computed, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useToast } from "@/composables/useToast";

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
const statusFilter = ref("");
const paymentFilter = ref("");
const startDate = ref("");
const endDate = ref("");

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

function openModal(tx) {
  selectedTransaction.value = tx;
  const modalEl = document.getElementById("transactionModal");
  const modal = new Modal(modalEl);
  modal.show();
}

function applyFilters() {
  filteredTransactions.value = transactions.value.filter((tx) => {
    const matchesSearch =
      !searchQuery.value ||
      tx.id.toString().includes(searchQuery.value) ||
      tx.selectedFlowers?.some((f) =>
        f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );

    const matchesStatus =
      !statusFilter.value ||
      tx.orderStatus.toLowerCase() === statusFilter.value;

    const matchesPayment =
      !paymentFilter.value ||
      (tx.mop && tx.mop.toLowerCase() === paymentFilter.value);

    const matchesDate =
      (!startDate.value ||
        new Date(tx.orderStart) >= new Date(startDate.value)) &&
      (!endDate.value || new Date(tx.orderEnd) <= new Date(endDate.value));

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

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

onMounted(() => {
  getTransactions();
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
          placeholder="Search by ID or item name"
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
          <option value="card">E-Wallet</option>
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
                  'bg-success': tx.orderStatus?.toLowerCase() === 'completed',
                  'bg-warning text-dark':
                    tx.orderStatus?.toLowerCase() === 'pending',
                  'bg-danger': tx.orderStatus?.toLowerCase() === 'cancelled',
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
                    selectedTransaction.orderStatus?.toLowerCase() ===
                    'completed',
                  'bg-warning text-dark':
                    selectedTransaction.orderStatus?.toLowerCase() ===
                    'pending',
                  'bg-danger':
                    selectedTransaction.orderStatus?.toLowerCase() ===
                    'cancelled',
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
                                return (
                                  sum +
                                  getTotal(selectedTransaction) *
                                    (d.value / 100)
                                );
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
</template>

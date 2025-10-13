<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { Modal, Toast } from "bootstrap";
import { useToast } from "@/composables/useToast";
import ItemService from "@/router/api/itemsService.js";
import PurchaseOrderService from "@/router/api/purchaseOrderService.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const { showToast } = useToast();

const selectedItems = ref([]);

const purchaseOrders = reactive({
  items: [],
  isLoading: true,
});

const purchaseOrdersDB = reactive({
  items: [],
  isLoading: true,
});

const selectedPOs = ref([]);
let exportPOModal;

const categories = ref([]);
const selectedCategory = ref("all");

const getItems = async () => {
  try {
    purchaseOrders.items = await ItemService.getItems();
    const uniqueCategories = [
      ...new Set(purchaseOrders.items.map((item) => item.category)),
    ];
    categories.value = uniqueCategories;
  } catch (err) {
    console.error("Error loading items:", err);
  } finally {
    purchaseOrders.isLoading = false;
  }
};

const filteredItems = computed(() => {
  if (selectedCategory.value === "all") return purchaseOrders.items;
  return purchaseOrders.items.filter(
    (item) => item.category === selectedCategory.value
  );
});

const purchaseForm = reactive({
  productId: null,
  name: "",
  currentStock: 0,
  quantity: 0,
  supplier: "",
  costPerUnit: 0,
});

const bulkForm = reactive({
  supplier: "",
  items: [],
});
let bulkPOModal;
const totalBulkCost = computed(() =>
  bulkForm.items.reduce(
    (sum, item) => sum + item.quantity * item.costPerUnit,
    0
  )
);

function openBulkPurchaseModal() {
  if (selectedItems.value.length === 0) {
    showToast("error", "Please select at least one item first.");
    return;
  }

  bulkForm.items = purchaseOrders.items
    .filter((item) => selectedItems.value.includes(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      currentStock: item.stock,
      quantity: 0,
      costPerUnit: item.cost || 0,
    }));

  bulkForm.supplier = "";
  bulkPOModal.show();
}

async function openExportModal() {
  try {
    purchaseOrdersDB.isLoading = true;
    purchaseOrdersDB.items = await PurchaseOrderService.getPurchaseOrders();
    selectedPOs.value = [];
    exportPOModal.show();
  } catch (err) {
    showToast("error", "Failed to load purchase orders.");
    console.error(err);
  } finally {
    purchaseOrdersDB.isLoading = false;
  }
}

let createPOModal;

function openPurchaseModal(item) {
  purchaseForm.productId = item.id;
  purchaseForm.name = item.name;
  purchaseForm.currentStock = item.stock;
  purchaseForm.quantity = 0;
  purchaseForm.supplier = "";
  purchaseForm.costPerUnit = item.cost || 0;

  createPOModal.show();
}

async function submitBulkPurchaseOrder() {
  if (!bulkForm.supplier || bulkForm.items.length === 0) {
    showToast("error", "Please select items and supplier first.");
    return;
  }

  try {
    for (const item of bulkForm.items) {
      const newStock = item.currentStock + item.quantity;
      await ItemService.updateItemStock(item.id, newStock);
    }

    await PurchaseOrderService.createPurchaseOrder({
      supplier: bulkForm.supplier,
      items: bulkForm.items.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.quantity,
        costPerUnit: i.costPerUnit,
      })),
    });

    showToast("success", "Bulk purchase order completed!");
    await getItems();

    Object.assign(bulkForm, { supplier: "", items: [] });
    bulkPOModal.hide();
  } catch (err) {
    console.error("Failed to submit bulk PO:", err);
    showToast("error", err.response?.data?.error || "Failed to submit order");
  }
}

async function submitPurchaseOrder() {
  if (!purchaseForm.productId || purchaseForm.quantity <= 0) {
    showToast("error", "Please enter a valid quantity.");
    return;
  }

  try {
    const newStock = purchaseForm.currentStock + purchaseForm.quantity;
    await ItemService.updateItemStock(purchaseForm.productId, newStock);

    showToast("success", "Purchase order completed successfully!");
    getItems();
  } catch (err) {
    console.error("Failed to submit purchase order:", err);
    showToast("error", "Failed to complete purchase order.");
  } finally {
    Object.assign(purchaseForm, {
      productId: null,
      name: "",
      currentStock: 0,
      quantity: 0,
      supplier: "",
      costPerUnit: 0,
    });

    createPOModal.hide();
  }
}

const areAllSelected = computed(() => {
  return (
    filteredItems.value.length > 0 &&
    filteredItems.value.every((item) => selectedItems.value.includes(item.id))
  );
});

function toggleSelectAll(event) {
  if (event.target.checked) {
    selectedItems.value = filteredItems.value.map((item) => item.id);
  } else {
    selectedItems.value = [];
  }
}

async function exportSelectedToExcel() {
  if (!selectedPOs.value.length) {
    showToast("error", "Please select at least one purchase order.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Selected Purchase Orders");

  worksheet.mergeCells("A1", "E1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Selected Purchase Orders Report";
  titleCell.font = { size: 16, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { horizontal: "center" };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "4F81BD" },
  };

  worksheet.mergeCells("A2", "E2");
  const dateCell = worksheet.getCell("A2");
  dateCell.value = `Generated on: ${new Date().toLocaleString()}`;
  dateCell.alignment = { horizontal: "center" };

  worksheet.addRow([]);

  for (const po of selectedPOs.value) {
    worksheet.addRow([
      `PO ID: ${po.id}`,
      `Supplier: ${po.supplier}`,
      `Date: ${new Date(po.createdAt).toLocaleString()}`,
    ]);
    const headerRow = worksheet.addRow([
      "Item ID",
      "Name",
      "Quantity",
      "Cost/unit (₱)",
      "Subtotal (₱)",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "305496" },
      };
      cell.border = {
        top: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      };
    });

    po.items.forEach((item) => {
      const row = worksheet.addRow([
        item.id,
        item.name,
        item.qty,
        item.costPerUnit,
        item.subtotal,
      ]);

      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "000000" } },
          left: { style: "thin", color: { argb: "000000" } },
          bottom: { style: "thin", color: { argb: "000000" } },
          right: { style: "thin", color: { argb: "000000" } },
        };
      });
    });

    const totalRow = worksheet.addRow([`Total Cost: ₱${po.totalCost}`]);
    totalRow.getCell(1).font = { bold: true };
    worksheet.addRow([]);
  }

  worksheet.columns = [
    { key: "id", width: 10 },
    { key: "name", width: 30 },
    { key: "qty", width: 12 },
    { key: "cost", width: 12 },
    { key: "subtotal", width: 12 },
  ];

  worksheet.autoFilter = {
    from: "A4",
    to: "E4",
  };

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "selected_purchase_orders.xlsx"
  );

  showToast("success", "Styled Excel export complete!");
  exportPOModal.hide();
}

async function exportSelectedToPDF() {
  if (!selectedPOs.value.length) {
    showToast("error", "Please select at least one purchase order.");
    return;
  }

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "A4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 40;

  doc.setFontSize(16);
  doc.text("Purchase Orders Report", pageWidth / 2, y, { align: "center" });
  y += 20;

  const now = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${now}`, pageWidth / 2, y, { align: "center" });
  y += 30;

  for (const po of selectedPOs.value) {
    doc.setFontSize(12);
    doc.text(
      `PO ID: ${po.id} | Supplier: ${po.supplier} | Date: ${new Date(
        po.createdAt
      ).toLocaleString()}`,
      40,
      y
    );
    y += 20;

    autoTable(doc, {
      startY: y,
      head: [["Item ID", "Name", "Qty", "Cost/unit (₱)", "Subtotal (₱)"]],
      body: po.items.map((i) => [
        i.id,
        i.name,
        i.qty,
        Number(i.costPerUnit).toLocaleString(),
        Number(i.subtotal).toLocaleString(),
      ]),
      styles: { fontSize: 9, cellPadding: 6, halign: "center" },
      headStyles: { fillColor: [79, 129, 189], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      theme: "grid",
    });

    y = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(
      `Total Cost: ₱${po.totalCost.toLocaleString()}`,
      pageWidth - 50,
      y,
      {
        align: "right",
      }
    );
    y += 30;

    if (y > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage();
      y = 40;
    }
  }

  doc.save("purchase_orders_selected.pdf");
  showToast("success", "Styled PDF export complete!");
  exportPOModal.hide();
}

onMounted(() => {
  getItems();
  bulkPOModal = new Modal(document.getElementById("bulkPOModal"));
  createPOModal = new Modal(document.getElementById("createPOModal"));
  exportPOModal = new Modal(document.getElementById("exportPOModal"));
});
</script>

<template>
  <main class="p-4">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Purchase Orders</h1>

      <div class="btn-group mb-4">
        <button
          type="button"
          class="btn btn-success"
          @click="openBulkPurchaseModal"
          :disabled="selectedItems.length === 0"
        >
          New Bulk Purchase Order
          <i class="bi bi-basket3 ms-1"></i>
        </button>
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="getItems"
        >
          Refresh
          <i class="bi bi-arrow-clockwise ms-1"></i>
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="openExportModal()"
        >
          Export to file
          <i class="bi bi-file-arrow-down"></i>
        </button>
      </div>
    </div>

    <!-- Category filter -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectedCategory = 'all'"
        >
          All
        </button>
      </li>
      <li v-for="category in categories" :key="category" class="nav-item">
        <button
          class="nav-link text-capitalize"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </li>
    </ul>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              @change="toggleSelectAll($event)"
              :checked="areAllSelected"
            />
          </th>
          <th>Name</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Cost</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="item.id">
          <td>
            <input type="checkbox" :value="item.id" v-model="selectedItems" />
          </td>
          <td>{{ item.name }}</td>
          <td>
            <span class="badge text-bg-secondary">{{ item.category }}</span>
          </td>
          <td>
            <span
              :class="{
                'text-success': item.stock > 10,
                'text-warning': item.stock <= 10 && item.stock > 0,
                'text-danger': item.stock === 0,
              }"
            >
              {{ item.stock }}
            </span>
          </td>
          <td>₱{{ item.cost }}</td>
          <td>
            <button
              class="btn btn-sm btn-primary"
              @click="openPurchaseModal(item)"
            >
              Create PO
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Purchase Order Modal -->
    <div
      class="modal fade"
      id="createPOModal"
      tabindex="-1"
      aria-labelledby="createPOModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createPOModalLabel">
              Create Purchase Order
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Product</label>
              <input
                type="text"
                class="form-control"
                v-model="purchaseForm.name"
                disabled
              />
            </div>

            <div class="row mb-3">
              <div class="col-md-6">
                <label class="form-label">Current Stock</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="purchaseForm.currentStock"
                  disabled
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Quantity to Add</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="purchaseForm.quantity"
                  min="1"
                />
              </div>
            </div>

            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="bulkSupplierInput"
                v-model="bulkForm.supplier"
                placeholder="Supplier name"
              />
              <label for="bulkSupplierInput">Supplier Name</label>
            </div>

            <div class="mb-3">
              <label class="form-label">Cost per Unit (₱)</label>
              <input
                type="number"
                class="form-control"
                v-model.number="purchaseForm.costPerUnit"
                min="0"
              />
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitPurchaseOrder"
            >
              Submit Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Purchase Order Modal -->
    <div
      class="modal fade"
      id="bulkPOModal"
      tabindex="-1"
      aria-labelledby="bulkPOModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="bulkPOModalLabel">
              Bulk Purchase Order
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="form-floating mb-3">
              <input
                type="text"
                class="form-control"
                id="bulkSupplierInput"
                v-model="bulkForm.supplier"
                placeholder="Supplier name"
              />
              <label for="bulkSupplierInput">Supplier Name</label>
            </div>

            <table class="table table-bordered table-sm align-middle">
              <thead class="table-light">
                <tr>
                  <th style="width: 5%">#</th>
                  <th>Item</th>
                  <th style="width: 10%">Current Stock</th>
                  <th style="width: 15%">Quantity to Add</th>
                  <th style="width: 15%">Cost/Unit (₱)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in bulkForm.items" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.currentStock }}</td>
                  <td>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      v-model.number="item.quantity"
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control form-control-sm"
                      v-model.number="item.costPerUnit"
                      min="0"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="border-top pt-3 mt-3" v-if="bulkForm.items.length > 0">
              <h6>Summary</h6>
              <ul class="list-group mb-3">
                <template v-for="(item, index) in bulkForm.items" :key="index">
                  <li
                    v-if="item && item.quantity > 0"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {{ item.name }} (x{{ item.quantity }})
                    <span>₱{{ item.quantity * item.costPerUnit }}</span>
                  </li>
                </template>
              </ul>

              <div class="d-flex justify-content-between fw-bold">
                <span>Total Cost</span>
                <span>₱{{ totalBulkCost }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="submitBulkPurchaseOrder"
            >
              Submit Bulk Purchase Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="exportPOModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Select Purchase Orders to Export</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body" v-if="purchaseOrdersDB.isLoading">
            Loading...
          </div>
          <div class="modal-body" v-else>
            <table class="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>PO ID</th>
                  <th>Supplier</th>
                  <th>Date</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="po in purchaseOrdersDB.items" :key="po.id">
                  <td>
                    <input type="checkbox" :value="po" v-model="selectedPOs" />
                  </td>
                  <td>{{ po.id }}</td>
                  <td>{{ po.supplier }}</td>
                  <td>{{ new Date(po.createdAt).toLocaleString() }}</td>
                  <td>₱{{ po.totalCost }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="exportSelectedToExcel"
            >
              Export to Excel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="exportSelectedToPDF"
            >
              Export to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Toast -->
  <div
    id="myToast"
    class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Success message</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

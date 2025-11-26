<template>
  <div class="database-management border rounded p-4 bg-white shadow-sm">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <div>
        <h5 class="mb-1">Database Management</h5>
        <p class="text-muted small mb-0">
          Export and import entire database. Admin only.
        </p>
      </div>
      <span class="badge bg-warning text-dark">
        <i class="bi bi-shield-lock"></i> Admin Only
      </span>
    </div>

    <!-- Export Section -->
    <div class="mb-4">
      <h6 class="text-secondary mb-3">
        <i class="bi bi-download"></i> Export Database
      </h6>
      <p class="small text-muted mb-3">
        Download the entire database as a JSON file. You will need to confirm
        your password.
      </p>

      <div class="d-grid gap-2 gap-sm-0">
        <button
          class="btn btn-outline-primary"
          @click="showExportModal = true"
          :disabled="isExporting || isImporting"
        >
          <span v-if="!isExporting">
            <i class="bi bi-download"></i> Export Database
          </span>
          <span v-else>
            <span class="spinner-border spinner-border-sm me-2"></span
            >Exporting...
          </span>
        </button>
      </div>
    </div>

    <hr class="my-4" />

    <!-- Import Section -->
    <div>
      <h6 class="text-secondary mb-3">
        <i class="bi bi-upload"></i> Import Database
      </h6>
      <p class="small text-muted mb-3">
        Import a previously exported database file. This will replace the entire
        current database. You will need to confirm your password.
      </p>

      <div class="d-grid gap-2 gap-sm-0">
        <button
          class="btn btn-outline-danger"
          @click="showImportModal = true"
          :disabled="isExporting || isImporting"
        >
          <i class="bi bi-upload"></i> Import Database
        </button>
      </div>
    </div>

    <!-- Export Modal -->
    <div
      v-if="showExportModal"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Export Database</h5>
            <button
              type="button"
              class="btn-close"
              @click="showExportModal = false"
              :disabled="isExporting"
            ></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info small mb-3">
              <i class="bi bi-info-circle"></i> Enter your password to confirm
              the export operation.
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group input-group-sm">
                <input
                  :type="showExportPassword ? 'text' : 'password'"
                  class="form-control"
                  v-model="exportPassword"
                  @keyup.enter="handleExport"
                  :disabled="isExporting"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showExportPassword = !showExportPassword"
                >
                  <i
                    :class="
                      showExportPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                    "
                  ></i>
                </button>
              </div>
            </div>

            <div v-if="exportError" class="alert alert-danger small mb-3">
              {{ exportError }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showExportModal = false"
              :disabled="isExporting"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleExport"
              :disabled="isExporting || !exportPassword"
            >
              <span v-if="!isExporting">Export</span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span
                >Exporting...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="modal d-block"
      style="background: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Import Database</h5>
            <button
              type="button"
              class="btn-close"
              @click="showImportModal = false"
              :disabled="isImporting"
            ></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning small mb-3">
              <i class="bi bi-exclamation-triangle"></i> Importing will replace
              the entire database. This action cannot be undone!
            </div>

            <!-- File Upload -->
            <div class="mb-3">
              <label class="form-label">Select Database File</label>
              <input
                type="file"
                class="form-control form-control-sm"
                accept=".json"
                @change="handleFileSelect"
                :disabled="isImporting"
              />
            </div>

            <!-- File Preview -->
            <div v-if="importFileData" class="mb-3">
              <div class="alert alert-info small">
                <strong>File Preview:</strong>
                <ul class="mb-0 mt-2">
                  <li>Users: {{ importFileData.users?.length || 0 }}</li>
                  <li>Items: {{ importFileData.items?.length || 0 }}</li>
                  <li v-if="importFileData.orders">
                    Orders: {{ importFileData.orders.length }}
                  </li>
                  <li v-if="importFileData.purchaseOrders">
                    Purchase Orders: {{ importFileData.purchaseOrders.length }}
                  </li>
                  <li v-if="importFileData.bouquets">
                    Bouquets: {{ importFileData.bouquets.length }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label class="form-label">Password</label>
              <div class="input-group input-group-sm">
                <input
                  :type="showImportPassword ? 'text' : 'password'"
                  class="form-control"
                  v-model="importPassword"
                  @keyup.enter="handleImport"
                  :disabled="isImporting || !importFileData"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showImportPassword = !showImportPassword"
                >
                  <i
                    :class="
                      showImportPassword ? 'bi bi-eye-slash' : 'bi bi-eye'
                    "
                  ></i>
                </button>
              </div>
            </div>

            <div v-if="importError" class="alert alert-danger small mb-3">
              {{ importError }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showImportModal = false"
              :disabled="isImporting"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleImport"
              :disabled="isImporting || !importFileData || !importPassword"
            >
              <span v-if="!isImporting">Import Database</span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span
                >Importing...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import DatabaseService from "@/router/api/DatabaseService";

const { showToast } = useToast();

const showExportModal = ref(false);
const showImportModal = ref(false);
const isExporting = ref(false);
const isImporting = ref(false);
const exportPassword = ref("");
const importPassword = ref("");
const showExportPassword = ref(false);
const showImportPassword = ref(false);
const exportError = ref("");
const importError = ref("");
const importFileData = ref(null);

async function handleExport() {
  exportError.value = "";
  isExporting.value = true;

  try {
    const result = await DatabaseService.exportDatabase(exportPassword.value);
    DatabaseService.downloadAsFile(result.data);
    showToast("success", "Database exported successfully");
    showExportModal.value = false;
    exportPassword.value = "";
  } catch (error) {
    console.error("Export failed:", error);
    const errorMsg =
      error.response?.data?.message || error.message || "Export failed";
    exportError.value = errorMsg;
    showToast("error", errorMsg);
  } finally {
    isExporting.value = false;
  }
}

async function handleFileSelect(event) {
  importError.value = "";
  const file = event.target.files?.[0];

  if (!file) {
    importFileData.value = null;
    return;
  }

  try {
    importFileData.value = await DatabaseService.parseUploadedFile(file);
  } catch (error) {
    importError.value = error.message;
    importFileData.value = null;
    showToast("error", error.message);
  }
}

async function handleImport() {
  importError.value = "";
  isImporting.value = true;

  try {
    const result = await DatabaseService.importDatabase(
      importFileData.value,
      importPassword.value
    );
    showToast("success", result.message || "Database imported successfully");
    showImportModal.value = false;
    importPassword.value = "";
    importFileData.value = null;

    // Reload the page after a successful import
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Import failed:", error);
    const errorMsg =
      error.response?.data?.message || error.message || "Import failed";
    importError.value = errorMsg;
    showToast("error", errorMsg);
  } finally {
    isImporting.value = false;
  }
}
</script>

<style scoped>
.database-management {
  border: 1px solid #e0e0e0 !important;
}

.modal.d-block {
  display: block !important;
}

.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>

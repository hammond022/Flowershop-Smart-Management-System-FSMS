<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Creating Purchase Orders</h1>
      <p class="lead text-muted">
        Follow these steps to create and manage purchase orders for your
        inventory
      </p>
    </div>

    <div class="timeline">
      <!-- Step 1 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              1
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Navigate to Inventory</h2>
              <p class="text-muted mb-3">
                Open the Inventory section from the main navigation bar.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture1.png"
                  alt="Navigate to Inventory"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              2
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Access Purchase Orders</h2>
              <p class="text-muted mb-3">
                Select Purchase Orders to view and manage purchase order
                entries.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture7.png"
                  alt="Access Purchase Orders"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              3
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Select Products</h2>
              <p class="text-muted mb-3">
                Choose one or more products for which you want to create a
                purchase order.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture8.png"
                  alt="Select Products"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              4
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Create a Bulk Purchase Order</h2>
              <p class="text-muted mb-3">
                Click New Bulk Purchase Order. A modal will appear allowing you
                to modify purchase details.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture9.png"
                  alt="Create a Bulk Purchase Order"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5 -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              5
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Enter Purchase Details</h2>
              <div class="img-container mb-4">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture10.png"
                  alt="Purchase Details Form"
                />
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-box text-primary"></i>
                    <div>
                      <h6 class="mb-1">Quantity to Add</h6>
                      <p class="small text-muted mb-0">
                        Specify the number of units to be added to stock.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-currency-dollar text-primary"></i>
                    <div>
                      <h6 class="mb-1">Cost/Unit</h6>
                      <p class="small text-muted mb-0">
                        Enter the cost per individual unit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 6 -->
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              ✓
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">Submit the Purchase Order</h2>
              <p class="text-muted mb-3">
                Click Submit Purchase Order to finalize and save the order.
              </p>
              <div class="img-container">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture11.png"
                  alt="Submit the Purchase Order"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped>
.step-badge {
  min-width: 40px;
  min-height: 40px;
}

.card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border-top: 3px solid var(--bs-primary);
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.img-container {
  display: inline-block;
  max-width: 100%;
}

.img-container img {
  max-width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
  }

  .step-badge {
    align-self: flex-start;
  }
}
</style>

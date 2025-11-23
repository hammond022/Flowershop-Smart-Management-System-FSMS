<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Deleting Products</h1>
      <p class="lead text-muted">
        Follow these steps to remove products from your inventory
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
                Navigate to the Inventory module from the main navigation bar.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture1.png"
                  alt="Navigate to Inventory"
                  loading="lazy"
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
              <h2 class="card-title h5 mb-2">Open the Products Section</h2>
              <p class="text-muted mb-3">
                Open the Products section to view all products in your
                inventory.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture2.png"
                  alt="Open the Products Section"
                  loading="lazy"
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
              <h2 class="card-title h5 mb-2">Select Products to Delete</h2>
              <p class="text-muted mb-3">
                Select the products you want to remove from the inventory list.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture28.png"
                  alt="Select Products to Delete"
                  loading="lazy"
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
              <h2 class="card-title h5 mb-2">Click Delete</h2>
              <p class="text-muted mb-3">
                Click the Delete button to initiate the deletion process.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture29.png"
                  alt="Click Delete"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5 -->
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
              <h2 class="card-title h5 mb-2">Confirm Deletion</h2>
              <p class="text-muted mb-3">
                Confirm the deletion when prompted. The product will be
                permanently removed from your inventory.
              </p>
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
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.img-container img[src] {
  animation: none;
  background: none;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
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

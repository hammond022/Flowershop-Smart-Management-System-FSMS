<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Creating Products</h1>
      <p class="lead text-muted">
        Follow these steps to add new products to your inventory
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
                From the main navigation bar, open the Inventory section.
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
              <h2 class="card-title h5 mb-2">Access the Products List</h2>
              <p class="text-muted mb-3">
                Select Products to view all existing product entries.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture2.png"
                  alt="Access the Products List"
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
              <h2 class="card-title h5 mb-2">
                Open the Product Creation Modal
              </h2>
              <p class="text-muted mb-3">
                Click Create Product. A modal window will appear where you can
                enter all required product details.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture3.png"
                  alt="Open the Product Creation Modal"
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
              <h2 class="card-title h5 mb-2">Fill in Product Details</h2>
              <div class="img-container mb-4">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture5.png"
                  alt="Product Details Form"
                  loading="lazy"
                />
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-image text-primary"></i>
                    <div>
                      <h6 class="mb-1">Product Photo</h6>
                      <p class="small text-muted mb-0">
                        Upload an image representing the product.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-tag text-primary"></i>
                    <div>
                      <h6 class="mb-1">Product Name</h6>
                      <p class="small text-muted mb-0">
                        Provide a concise name for the product. Avoid
                        descriptive details here, as they belong in the
                        description field.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-bookmark text-primary"></i>
                    <div>
                      <h6 class="mb-1">Tags</h6>
                      <p class="small text-muted mb-0">
                        Add relevant descriptors that may apply to multiple
                        products.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-file-text text-primary"></i>
                    <div>
                      <h6 class="mb-1">Description</h6>
                      <p class="small text-muted mb-0">
                        Enter a detailed explanation of the product, including
                        its use and any additional relevant information.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-folder text-primary"></i>
                    <div>
                      <h6 class="mb-1">Category</h6>
                      <p class="small text-muted mb-0">
                        Assign the product to an existing category or create a
                        new one as needed.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-currency-dollar text-primary"></i>
                    <div>
                      <h6 class="mb-1">Selling Price</h6>
                      <p class="small text-muted mb-0">
                        Specify the price at which the product was purchased.
                        This can be updated when creating purchase orders.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <i class="bi bi-cash-coin text-primary"></i>
                    <div>
                      <h6 class="mb-1">Cost Price</h6>
                      <p class="small text-muted mb-0">
                        Specify the individual selling price of the product.
                      </p>
                    </div>
                  </div>
                </div>
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
              <h2 class="card-title h5 mb-2">Save the Product</h2>
              <p class="text-muted mb-3">
                Click Save Product to finalize the entry. Ensure all required
                fields are completed before saving.
              </p>
              <div class="img-container">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture6.png"
                  alt="Save the Product"
                  loading="lazy"
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

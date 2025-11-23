<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Products</h1>
      <p class="lead text-muted">
        Understanding products and how they work in the system
      </p>
    </div>

    <div class="timeline">
      <!-- Overview -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              ℹ
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">What is a Product?</h2>
              <p class="text-muted mb-0">
                A <strong>Product</strong> (also referred to as an "Item" in the
                system) is a fundamental unit in your inventory. Products
                represent individual floral items, supplies, or arrangements
                that can be sold to customers or used to create custom bouquets.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Product Structure -->
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
              <h2 class="card-title h5 mb-4">Product Object Structure</h2>
              <p class="text-muted mb-3">
                Each product contains the following information:
              </p>

              <div class="row g-3">
                <!-- Name -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-tag text-primary"></i>
                    <div>
                      <h6 class="mb-1">Name</h6>
                      <p class="small text-muted mb-0">
                        The product's display name (e.g., "Red Rose", "White
                        Lily"). Must be unique. Used by the Bouquet Generator to
                        identify similarities between products.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-file-text text-primary"></i>
                    <div>
                      <h6 class="mb-1">Description</h6>
                      <p class="small text-muted mb-0">
                        Detailed information about the product (e.g., "Fresh red
                        roses, perfect for expressing love"). Helps staff
                        understand the product's characteristics and use cases.
                        Used by the Bouquet Generator to identify similarities.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Category -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-folder text-primary"></i>
                    <div>
                      <h6 class="mb-1">Category</h6>
                      <p class="small text-muted mb-0">
                        Groups similar products together (e.g., "Flowers",
                        "Vases", "Accessories"). Used for organizing inventory
                        and filtering items during POS transactions.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Tags -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-bookmark text-primary"></i>
                    <div>
                      <h6 class="mb-1">Tags</h6>
                      <p class="small text-muted mb-0">
                        Short descriptive labels that capture key
                        characteristics (e.g., colors like "red", "green" or
                        occasions like "birthday", "wedding"). Used by the
                        Bouquet Generator and for searching products.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Photo -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-image text-primary"></i>
                    <div>
                      <h6 class="mb-1">Photo</h6>
                      <p class="small text-muted mb-0">
                        Displayed in the inventory management interface and
                        helps staff identify products quickly. Not used by the
                        system for information purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Price -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-currency-dollar text-primary"></i>
                    <div>
                      <h6 class="mb-1">Price</h6>
                      <p class="small text-muted mb-0">
                        The selling price per unit, charged to customers. This
                        is displayed to customers and used in order
                        calculations.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Cost -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-cash-coin text-primary"></i>
                    <div>
                      <h6 class="mb-1">Cost</h6>
                      <p class="small text-muted mb-0">
                        The cost per unit to the business. Used for calculating
                        profit margins and business analytics. Not visible to
                        customers. Used for Purchase Orders.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Stock -->
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <i class="bi bi-box text-primary"></i>
                    <div>
                      <h6 class="mb-1">Stock</h6>
                      <p class="small text-muted mb-0">
                        The current quantity of this product available in
                        inventory. When processing sales, the stock is
                        automatically decreased. Stock is increased by making
                        Purchase Orders.
                      </p>
                    </div>
                  </div>
                </div>
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

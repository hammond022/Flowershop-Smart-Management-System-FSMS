<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Purchase Orders</h1>
      <p class="lead text-muted">
        Understanding purchase orders and how they work in the system
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
              <h2 class="card-title h5 mb-2">What is a Purchase Order?</h2>
              <p class="text-muted mb-0">
                A <strong>Purchase Order</strong> is used to restock inventory
                and help you track incoming products, including the quantities
                purchased and the prices paid.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Purchase Order Structure -->
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
              <h2 class="card-title h5 mb-4">
                Purchase Order Object Structure
              </h2>
              <p class="text-muted mb-3">
                Each purchase order contains the following information:
              </p>

              <div class="row g-3">
                <!-- Purchase Order ID -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-hash text-primary"></i>
                    <div>
                      <h6 class="mb-1">Purchase Order ID</h6>
                      <p class="small text-muted mb-0">
                        A unique identifier automatically assigned when the
                        purchase order is created. Used internally to reference
                        and track the purchase order throughout the system.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Supplier -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-shop text-primary"></i>
                    <div>
                      <h6 class="mb-1">Supplier</h6>
                      <p class="small text-muted mb-0">
                        The vendor or supplier from whom the inventory is being
                        ordered. Stores supplier information for tracking and
                        reordering purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Items -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-bag text-primary"></i>
                    <div class="w-100">
                      <h6 class="mb-2">Items</h6>
                      <p class="small text-muted mb-3">
                        The products included in the purchase order. Multiple
                        items can be part of a single purchase order.
                      </p>
                      <div
                        class="bg-light rounded p-3 border-start border-4 border-primary"
                      >
                        <div class="mb-3">
                          <div class="d-flex gap-2 align-items-center mb-1">
                            <i
                              class="bi bi-123 text-primary"
                              style="font-size: 0.9rem"
                            ></i>
                            <h6 class="mb-0 small fw-600">Quantity</h6>
                          </div>
                          <p class="small text-muted mb-0 ms-4">
                            The amount of each product being ordered. When the
                            order is received, this quantity is added to the
                            product's stock.
                          </p>
                        </div>
                        <div>
                          <div class="d-flex gap-2 align-items-center mb-1">
                            <i
                              class="bi bi-cash-coin text-primary"
                              style="font-size: 0.9rem"
                            ></i>
                            <h6 class="mb-0 small fw-600">Cost</h6>
                          </div>
                          <p class="small text-muted mb-0 ms-4">
                            The cost per unit to the business. Defaults to the
                            value entered during the creation of the product.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Order Date -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-calendar-event text-primary"></i>
                    <div>
                      <h6 class="mb-1">Order Date</h6>
                      <p class="small text-muted mb-0">
                        The date when the purchase order was created. Used for
                        tracking order history and delivery timelines.
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

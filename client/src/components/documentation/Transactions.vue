<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Transactions</h1>
      <p class="lead text-muted">
        Understanding transactions and how they work in the system
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
              <h2 class="card-title h5 mb-2">What is a Transaction?</h2>
              <p class="text-muted mb-0">
                A <strong>Transaction</strong> is a record of a sale or exchange
                of products with customers. Each transaction captures the
                details of what was sold, to whom, when, and for how much. These
                records are essential for tracking sales history and inventory
                management.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Structure -->
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
              <h2 class="card-title h5 mb-4">Transaction Object Structure</h2>
              <p class="text-muted mb-3">
                Each transaction contains the following information:
              </p>

              <div class="row g-3">
                <!-- Transaction ID -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-hash text-primary"></i>
                    <div>
                      <h6 class="mb-1">Transaction ID</h6>
                      <p class="small text-muted mb-0">
                        A unique identifier automatically assigned when the
                        transaction is created. Used internally to reference and
                        track the transaction throughout the system.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Date & Time -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-calendar-event text-primary"></i>
                    <div>
                      <h6 class="mb-1">Date & Time</h6>
                      <p class="small text-muted mb-0">
                        The exact date and time when the transaction was
                        completed. Used for chronological tracking and
                        historical record-keeping.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Items -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-bag text-primary"></i>
                    <div>
                      <h6 class="mb-1">Items</h6>
                      <p class="small text-muted mb-0">
                        The products included in the transaction. Each item
                        contains quantity, unit price, and line total. Multiple
                        items can be part of a single transaction.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Customer -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-person text-primary"></i>
                    <div>
                      <h6 class="mb-1">Customer</h6>
                      <p class="small text-muted mb-0">
                        Optional information about the customer making the
                        purchase. Useful for tracking customer preferences and
                        purchase history.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Subtotal -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-calculator text-primary"></i>
                    <div>
                      <h6 class="mb-1">Subtotal</h6>
                      <p class="small text-muted mb-0">
                        The total price of all items before taxes or discounts.
                        Calculated automatically from item quantities and unit
                        prices.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Discount -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-percent text-primary"></i>
                    <div>
                      <h6 class="mb-1">Discount</h6>
                      <p class="small text-muted mb-0">
                        Optional discount applied to the transaction (amount or
                        percentage). Reduces the final total customers must pay.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Tax -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-receipt text-primary"></i>
                    <div>
                      <h6 class="mb-1">Tax</h6>
                      <p class="small text-muted mb-0">
                        Any applicable tax or sales tax on the transaction.
                        Calculated based on local tax regulations and rates.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Total -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-currency-dollar text-primary"></i>
                    <div>
                      <h6 class="mb-1">Total</h6>
                      <p class="small text-muted mb-0">
                        The final amount due from the customer. Calculated as
                        subtotal minus discount plus tax.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Payment Method -->
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-credit-card text-primary"></i>
                    <div>
                      <h6 class="mb-1">Payment Method</h6>
                      <p class="small text-muted mb-0">
                        How the customer paid (e.g., cash, card, online). Used
                        for accounting and financial tracking purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Status -->
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <i class="bi bi-flag text-primary"></i>
                    <div>
                      <h6 class="mb-1">Status</h6>
                      <p class="small text-muted mb-0">
                        The state of the transaction (completed, pending,
                        cancelled). Tracks whether the transaction was
                        successfully processed.
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

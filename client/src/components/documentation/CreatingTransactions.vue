<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Creating Transactions</h1>
      <p class="lead text-muted">
        Follow these steps to process and complete transactions in the POS
        system
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
              <h2 class="card-title h5 mb-2">Navigate to POS</h2>
              <p class="text-muted mb-3">
                From the main navigation bar, open the
                <strong>POS</strong> section.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture12.png"
                  alt="Navigate to POS"
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
              <h2 class="card-title h5 mb-2">Select a Product</h2>
              <p class="text-muted mb-3">
                Click on a product to initiate a new transaction.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture17.png"
                  alt="Select a Product"
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
              <h2 class="card-title h5 mb-2">Proceed to Checkout</h2>
              <p class="text-muted mb-3">
                Click <strong>Checkout</strong>. A modal will appear displaying
                the order details.
              </p>
              <div class="img-container mb-3">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture13.png"
                  alt="Proceed to Checkout"
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
              <h2 class="card-title h5 mb-2">Enter Transaction Details</h2>
              <div class="img-container mb-4">
                <img
                  class="img-fluid rounded"
                  src="../../assets/documentation/Picture14.png"
                  alt="Enter Transaction Details"
                />
              </div>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-chat-square-dots text-primary"></i>
                    <div>
                      <h6 class="mb-1">
                        Customer Notes
                        <span class="badge bg-secondary">Optional</span>
                      </h6>
                      <p class="small text-muted mb-0">
                        Add notes that will apply to the entire transaction.
                        This will appear in the transaction details.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-person text-primary"></i>
                    <div>
                      <h6 class="mb-1">
                        Customer Details
                        <span class="badge bg-secondary">Optional*</span>
                      </h6>
                      <p class="small text-muted mb-0">
                        Enter the customer's name and contact number. These
                        fields become <strong>mandatory</strong> when the
                        payment method is <strong>Bank Transfer</strong> or
                        <strong>E-wallet</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-credit-card text-primary"></i>
                    <div>
                      <h6 class="mb-1">Payment Method</h6>
                      <p class="small text-muted mb-0">
                        Choose from <strong>Cash</strong> or
                        <strong>Bank Transfer/E-wallet</strong>. Bank
                        Transfer/E-wallet transactions will require verification
                        and will initially be marked as pending.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2 mb-3">
                    <i class="bi bi-cash-coin text-primary"></i>
                    <div>
                      <h6 class="mb-1">Amount Paid</h6>
                      <p class="small text-muted mb-0">
                        For cash payments, enter the amount received from the
                        customer.
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
              <h2 class="card-title h5 mb-2">Complete the Transaction</h2>
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <i class="bi bi-check-circle text-success"></i>
                    <div>
                      <h6 class="mb-1">For Cash Payments</h6>
                      <p class="small text-muted mb-0">
                        Click <strong>Confirm Checkout</strong> to complete the
                        transaction immediately.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex gap-2">
                    <i class="bi bi-hourglass-split text-warning"></i>
                    <div>
                      <h6 class="mb-1">For Bank Transfer/E-wallet</h6>
                      <p class="small text-muted mb-0">
                        Click <strong>Confirm as Pending</strong> to record the
                        transaction and verify it later.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 mb-4">
                <h6 class="mb-2">For Cash Payments</h6>
                <div class="img-container">
                  <img
                    class="img-fluid rounded"
                    src="../../assets/documentation/Picture15.png"
                    alt="Complete the Transaction - Cash"
                  />
                </div>
              </div>

              <div>
                <h6 class="mb-2">Bank Transfer/E-wallet</h6>
                <div class="img-container">
                  <img
                    class="img-fluid rounded"
                    src="../../assets/documentation/Picture16.png"
                    alt="Complete the Transaction - Bank Transfer/E-wallet"
                  />
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

.placeholder-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 250px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 2px dashed #ccc;
  border-radius: 8px;
  color: #666;
  font-size: 3rem;
}

.placeholder-image i {
  margin-bottom: 10px;
  opacity: 0.5;
}

.placeholder-image p {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .d-flex.gap-3 {
    flex-direction: column;
  }

  .step-badge {
    align-self: flex-start;
  }

  .placeholder-image {
    min-height: 200px;
    font-size: 2rem;
  }
}
</style>

<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">Resolving a Transaction</h1>
      <p class="lead text-muted">
        Learn how to resolve transactions in the system
      </p>
    </div>

    <div class="timeline">
      <!-- Step 1: Navigate to Transactions -->
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
              <h2 class="card-title h5 mb-3">
                Step 1: Navigate to the Transactions Section
              </h2>
              <p class="text-muted mb-3">
                Navigate to the <strong>Transactions</strong> section using the
                navigation bar.
              </p>
              <img
                src="@/assets/documentation/Picture18.png"
                alt="Navigate to Transactions"
                class="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Locate and View Transaction -->
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
              <h2 class="card-title h5 mb-3">
                Step 2: Locate the Transaction and Click View
              </h2>
              <p class="text-muted mb-3">
                Locate the specific transaction you want to resolve and click
                <strong>View</strong>. A modal will open displaying the
                transaction details.
              </p>
              <img
                src="@/assets/documentation/Picture19.png"
                alt="Click View on Transaction"
                class="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Click Resolve -->
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
              <h2 class="card-title h5 mb-3">Step 3: Click Resolve</h2>
              <p class="text-muted mb-3">
                Click <strong>Resolve</strong> to open the resolution modal.
              </p>
              <img
                src="@/assets/documentation/Picture20.png"
                alt="Click Resolve Button"
                class="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 4: Enter Reference Number -->
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
              <h2 class="card-title h5 mb-3">
                Step 4: Enter the Reference Number
              </h2>
              <p class="text-muted mb-3">
                Enter the <strong>Reference Number</strong> provided by the bank
                or e-wallet.
              </p>
              <img
                src="@/assets/documentation/Picture21.png"
                alt="Enter Reference Number"
                class="img-fluid rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 5: Complete Transaction -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              ✓
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-2">
                Step 5: Complete the Transaction
              </h2>
              <p class="text-muted mb-0">
                Click <strong>Complete Transaction</strong> to mark the
                transaction as "complete".
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
}

.timeline .card {
  transition: all 0.3s ease;
}

.timeline .card:hover {
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}
</style>

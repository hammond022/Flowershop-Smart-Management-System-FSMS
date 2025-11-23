<template>
  <section class="py-4">
    <div class="mb-5">
      <h1 class="display-5 fw-bold text-dark mb-2">
        Welcome to ITPM Inventory System
      </h1>
      <p class="lead text-muted">
        A comprehensive solution for managing flower shop inventory, sales, and
        supply chain operations
      </p>
    </div>

    <!-- Overview Section -->
    <div class="mb-5">
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              ℹ
            </div>
            <div class="flex-grow-1">
              <h2 class="card-title h5 mb-3">System Overview</h2>
              <p class="text-muted mb-0">
                The ITPM Inventory System is designed to streamline operations
                for flower shops and botanical retailers. It provides a
                centralized platform to manage your product catalog, track
                inventory levels, process sales transactions, and organize
                supplier relationships. Whether you're managing fresh flowers,
                arrangements, or related supplies, this system ensures efficient
                inventory control and accurate sales tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Features Section -->
    <div class="mb-5">
      <h3 class="fw-bold text-dark mb-4">Core Features</h3>
      <div class="row g-4">
        <!-- Products -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex gap-3 mb-3">
                <div
                  class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px; flex-shrink: 0"
                >
                  <i
                    class="bi bi-box2 text-primary fw-bold"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
                <div>
                  <h5 class="card-title mb-0">Product Management</h5>
                </div>
              </div>
              <p class="text-muted mb-3">
                Maintain a complete catalog of all inventory items with detailed
                information including descriptions, categories, and pricing.
              </p>
              <RouterLink
                to="/documentation/products"
                class="btn btn-sm btn-outline-primary"
              >
                Learn More →
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Purchase Orders -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex gap-3 mb-3">
                <div
                  class="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px; flex-shrink: 0"
                >
                  <i
                    class="bi bi-graph-up text-success fw-bold"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
                <div>
                  <h5 class="card-title mb-0">Purchase Orders</h5>
                </div>
              </div>
              <p class="text-muted mb-3">
                Track incoming inventory, manage supplier relationships, and
                keep records of all restocking activities with detailed cost
                tracking.
              </p>
              <RouterLink
                to="/documentation/purchase-orders"
                class="btn btn-sm btn-outline-success"
              >
                Learn More →
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Transactions -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex gap-3 mb-3">
                <div
                  class="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                  style="width: 50px; height: 50px; flex-shrink: 0"
                >
                  <i
                    class="bi bi-credit-card text-warning fw-bold"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
                <div>
                  <h5 class="card-title mb-0">Transactions</h5>
                </div>
              </div>
              <p class="text-muted mb-3">
                Record all sales with automatic inventory deduction, maintain
                customer history, and generate comprehensive sales reports.
              </p>
              <RouterLink
                to="/documentation/transactions"
                class="btn btn-sm btn-outline-warning"
              >
                Learn More →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Getting Started Section -->
    <div class="mb-5">
      <h3 class="fw-bold text-dark mb-4">Getting Started</h3>
      <p class="text-muted mb-4">
        Follow these guides to set up and begin using the system:
      </p>
      <div class="row g-3">
        <div class="col-md-4">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              1
            </div>
            <div>
              <h6 class="fw-bold mb-2">Create Your First Products</h6>
              <p class="small text-muted mb-3">
                Set up your inventory by adding products to the system.
              </p>
              <RouterLink
                to="/documentation/creating-products"
                class="small text-decoration-none"
              >
                View Guide →
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              2
            </div>
            <div>
              <h6 class="fw-bold mb-2">Process Purchase Orders</h6>
              <p class="small text-muted mb-3">
                Restock inventory and track supplier deliveries.
              </p>
              <RouterLink
                to="/documentation/creating-purchase-orders"
                class="small text-decoration-none"
              >
                View Guide →
              </RouterLink>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="d-flex gap-3">
            <div
              class="step-badge bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style="width: 40px; height: 40px; flex-shrink: 0"
            >
              3
            </div>
            <div>
              <h6 class="fw-bold mb-2">Record Sales Transactions</h6>
              <p class="small text-muted mb-3">
                Process customer sales and maintain sales records.
              </p>
              <RouterLink
                to="/documentation/creating-transactions"
                class="small text-decoration-none"
              >
                View Guide →
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Next Steps Section -->
    <div class="card border-0 bg-light shadow-sm">
      <div class="card-body">
        <h5 class="card-title fw-bold mb-3">Ready to Continue?</h5>
        <p class="text-muted mb-3">
          Explore detailed documentation on specific topics or follow
          step-by-step guides to master each feature. Use the navigation menu on
          the left to browse all available resources.
        </p>
        <div class="d-flex gap-2">
          <RouterLink
            to="/documentation/products"
            class="btn btn-primary btn-sm"
          >
            Explore Products
          </RouterLink>
          <RouterLink
            to="/documentation/creating-products"
            class="btn btn-outline-primary btn-sm"
          >
            Creating Products Guide
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.step-badge {
  font-size: 1rem;
  flex-shrink: 0;
}

.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px -6px rgba(0, 0, 0, 0.12) !important;
}

.btn-sm {
  font-size: 0.875rem;
  padding: 0.4rem 0.8rem;
}

.display-5 {
  font-size: 2.5rem;
  line-height: 1.2;
}

@media (max-width: 767.98px) {
  .display-5 {
    font-size: 1.75rem;
  }

  .row.g-4 > .col-md-6 {
    margin-bottom: 1rem;
  }
}
</style>

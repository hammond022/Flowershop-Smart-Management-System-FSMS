<template>
  <aside class="docs-sidebar">
    <nav>
      <h5 class="px-3 pt-3">Documentation</h5>
      <ul class="list-unstyled mb-0">
        <li>
          <RouterLink
            to="/documentation/introduction"
            class="sidebar-link"
            active-class="active"
            >Introduction</RouterLink
          >
          <ul class="list-unstyled nested-list">
            <li>
              <RouterLink
                to="/documentation/creating-products"
                class="sidebar-link nested-link"
                active-class="active"
                >Creating Products</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/creating-purchase-orders"
                class="sidebar-link nested-link"
                active-class="active"
                >Creating Purchase Orders</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/creating-transactions"
                class="sidebar-link nested-link"
                active-class="active"
                >Creating Transactions</RouterLink
              >
            </li>
          </ul>
        </li>
        <li>
          <RouterLink
            to="/documentation/products"
            class="sidebar-link"
            active-class="active"
            >Products</RouterLink
          >
          <ul class="list-unstyled nested-list">
            <li>
              <RouterLink
                to="/documentation/deleting-products"
                class="sidebar-link nested-link"
                active-class="active"
                >Deleting Products</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/creating-custom-bouquet"
                class="sidebar-link nested-link"
                active-class="active"
                >Creating Custom Bouquet</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/updating-custom-bouquet"
                class="sidebar-link nested-link"
                active-class="active"
                >Updating Custom Bouquet</RouterLink
              >
            </li>
          </ul>
        </li>
        <li>
          <RouterLink
            to="/documentation/transactions"
            class="sidebar-link"
            active-class="active"
            >Transactions</RouterLink
          >
          <ul class="list-unstyled nested-list">
            <li>
              <RouterLink
                to="/documentation/resolving-pending-transaction"
                class="sidebar-link nested-link"
                active-class="active"
                >Resolving a pending transaction</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/adding-discounts"
                class="sidebar-link nested-link"
                active-class="active"
                >Adding discounts</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/documentation/printing-transactions"
                class="sidebar-link nested-link"
                active-class="active"
                >Printing Transactions</RouterLink
              >
            </li>
          </ul>
        </li>
        <li>
          <RouterLink
            to="/documentation/purchase-orders"
            class="sidebar-link"
            active-class="active"
            >Purchase Orders</RouterLink
          >
          <ul class="list-unstyled nested-list">
            <li>
              <RouterLink
                to="/documentation/exporting-purchase-order-reports"
                class="sidebar-link nested-link"
                active-class="active"
                >Exporting Purchase Order Reports</RouterLink
              >
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.docs-sidebar {
  position: sticky;
  top: 80px; /* space below navbar */
  width: 250px;
  max-height: calc(100vh - 110px);
  overflow-y: auto;
  margin: 1.25rem 2rem 2rem 1.25rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 6px 20px -6px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05);
}
.sidebar-link {
  display: block;
  padding: 0.55rem 1rem;
  color: #444;
  text-decoration: none;
  font-size: 0.95rem;
  border-left: 3px solid transparent;
}
.sidebar-link:hover {
  background: #f7f7f7;
  color: #111;
}
.active {
  font-weight: 600;
  background: #eef6ff;
  border-left-color: #0d6efd;
  color: #0d6efd;
}
.nested-list {
  margin: 0;
}
.nested-link {
  padding: 0.4rem 1rem 0.4rem 2rem;
  font-size: 0.9rem;
  background: #f9f9f9;
}
.nested-link:hover {
  background: #f0f0f0;
}
/* Custom minimal scrollbar (WebKit) */
.docs-sidebar::-webkit-scrollbar {
  width: 10px;
}
.docs-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.docs-sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 8px;
}
.docs-sidebar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 991.98px) {
  .docs-sidebar {
    position: static;
    width: 100%;
    max-height: none;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    border-radius: 8px;
    padding: 0.5rem 0.25rem;
  }
  .docs-sidebar nav {
    width: 100%;
  }
  .docs-sidebar h5 {
    display: none;
  }
  .docs-sidebar ul {
    display: flex;
    gap: 0.25rem;
  }
  .sidebar-link {
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 0.5rem 0.85rem;
    white-space: nowrap;
  }
  .nested-list {
    display: none;
  }
  .active {
    border-bottom-color: #0d6efd;
    background: transparent;
  }
}
</style>

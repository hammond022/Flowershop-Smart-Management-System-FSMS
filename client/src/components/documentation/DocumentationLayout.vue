<template>
  <div class="docs-layout">
    <DocumentationSidebar />
    <main class="docs-content container-fluid">
      <div class="paper mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import DocumentationSidebar from "./DocumentationSidebar.vue";
</script>

<style scoped>
.docs-layout {
  display: flex;
  align-items: flex-start;
}
.docs-content {
  flex: 1;
  padding: 2.5rem 3rem 4rem;
  min-height: calc(100vh - 70px);
  background: linear-gradient(#f8fafc, #f1f5f9);
}
.paper {
  background: #ffffff;
  padding: 2.5rem 3rem;
  max-width: 980px;
  border-radius: 12px;
  box-shadow: 0 6px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
}
.paper h1,
.paper h2,
.paper h3,
.paper h4 {
  font-weight: 600;
  color: #1e293b;
}
.paper p.placeholder {
  color: #64748b;
  font-style: italic;
}
@media (max-width: 991.98px) {
  .docs-layout {
    flex-direction: column;
  }
  .docs-content {
    padding: 1.5rem 1.25rem 3rem;
  }
  .paper {
    padding: 2rem 1.5rem;
  }
}
</style>

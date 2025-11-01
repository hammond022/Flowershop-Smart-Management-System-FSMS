<!-- idk what the fuck this is  -->

<script setup></script>

<template>
  <div
    id="itemsCollapse"
    class="accordion-collapse collapse show"
    data-bs-parent="#transactionAccordion"
  >
    <div class="accordion-body">
      <ul class="list-group list-group-flush">
        <li
          v-for="item in selectedTransaction.selectedFlowers"
          :key="item.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          {{ item.qty }}x {{ item.name }}
          <span>{{
            new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(item.price * (item.qty || 0))
          }}</span>
        </li>

        <li
          v-if="selectedTransaction.discounts?.length > 0"
          class="list-group-item d-flex justify-content-between align-items-center fw-bold"
        >
          Discount Total:
          <span class="badge bg-primary">
            {{
              selectedTransaction.discounts.reduce((sum, d) => {
                if (d.type === "percent")
                  return sum + getTotal(selectedTransaction) * (d.value / 100);
                return sum + d.value;
              }, 0)
            }}
          </span>
        </li>

        <li
          class="list-group-item d-flex justify-content-between align-items-center list-group-item-success"
        >
          Total:
          <span>{{
            new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(getTotal(selectedTransaction))
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<!-- idk what the fuck this is  -->

<script setup></script>

<template>
  <div
    id="myToast"
    class="toast align-items-center border-0 position-fixed bottom-0 end-0 p-3 m-3 shadow-sm"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Successfully created product</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>

  <script>
    function setToastClass(type) {
      const toast = document.getElementById("myToast");

      // remove existing status classes
      toast.classList.remove("bg-success", "bg-danger", "bg-warning");

      // dynamically add based on type
      if (type === "success") {
        toast.classList.add("bg-success", "text-white");
      } else if (type === "error") {
        toast.classList.add("bg-danger", "text-white");
      } else if (type === "warning") {
        toast.classList.add("bg-warning", "text-dark");
      }
    }

    // Example usage:
    setToastClass("success");
  </script>
</template>

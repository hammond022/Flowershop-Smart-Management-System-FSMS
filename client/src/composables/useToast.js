import { Toast } from "bootstrap";
// number of hours wasted troubleshooting = 2

export function useToast() {
  let toastInstance;

  function showToast(type, message) {
    const toastEl = document.getElementById("myToast");
    if (!toastEl) {
      console.warn(
        'useToast: #myToast element not found. Add a <div id="myToast"> to App.vue or the current view.'
      );
      return;
    }

    const toastBody = toastEl.querySelector(".toast-body");
    toastBody.textContent = message;

    toastEl.classList.remove(
      "bg-success",
      "bg-danger",
      "bg-warning",
      "text-white",
      "text-dark"
    );

    if (type === "success") toastEl.classList.add("bg-success", "text-white");
    if (type === "error") toastEl.classList.add("bg-danger", "text-white");
    if (type === "warning") toastEl.classList.add("bg-warning", "text-dark");

    toastInstance = new Toast(toastEl, { delay: 3000, autohide: true });
    toastInstance.show();
  }

  return { showToast };
}

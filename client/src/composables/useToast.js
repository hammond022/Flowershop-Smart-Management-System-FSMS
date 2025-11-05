import { Toast } from "bootstrap";

export function useToast() {
  let toastInstance;

  function showToast(type, message) {
    const toastEl = document.getElementById("myToast");
    if (!toastEl) return;

    // Update toast content
    const toastBody = toastEl.querySelector(".toast-body");
    toastBody.textContent = message;

    // Reset classes
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

    // Initialize new instance each time (Bootstrap is safe to re-init)
    toastInstance = new Toast(toastEl, { delay: 3000, autohide: true });
    toastInstance.show();
  }

  return { showToast };
}

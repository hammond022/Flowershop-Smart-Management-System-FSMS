import { Toast } from "bootstrap";

let toastInstance;

export function useToast() {
  function initToast() {
    if (!toastInstance) {
      const el = document.getElementById("myToast");
      toastInstance = new Toast(el, { delay: 3000, autohide: true });
    }
  }

  function showToast(type, message) {
    initToast();
    const toast = document.getElementById("myToast");
    const toastBody = toast.querySelector(".toast-body");

    toast.classList.remove(
      "bg-success",
      "bg-danger",
      "bg-warning",
      "text-white",
      "text-dark"
    );

    toastBody.textContent = message;

    if (type === "success") toast.classList.add("bg-success", "text-white");
    if (type === "error") toast.classList.add("bg-danger", "text-white");
    if (type === "warning") toast.classList.add("bg-warning", "text-dark");

    toastInstance.show();
  }

  return { showToast };
}

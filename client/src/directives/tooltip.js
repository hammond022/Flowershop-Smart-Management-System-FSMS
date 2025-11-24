import { Tooltip } from "bootstrap";

export default {
  mounted(el, binding) {
    const value = binding.value;
    let options = {};

    if (typeof value === "string") {
      options.title = value;
    } else if (typeof value === "object") {
      options = value;
    }

    el.setAttribute("data-bs-toggle", "tooltip");
    if (options.title) el.setAttribute("title", options.title);

    el._tooltip = new Tooltip(el, {
      title: options.title || "",
      placement: options.placement || "top",
      trigger: options.trigger || "hover focus",
    });
  },

  updated(el, binding) {
    const newTitle =
      typeof binding.value === "object" ? binding.value.title : binding.value;
    if (el._tooltip) {
      el.setAttribute("title", newTitle || "");
      el._tooltip.setContent({ ".tooltip-inner": newTitle });
    }
  },

  beforeUnmount(el) {
    if (el._tooltip) {
      el._tooltip.dispose();
      delete el._tooltip;
    }
  },
};

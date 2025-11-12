import { ref, onMounted, onUnmounted, computed } from "vue";

export function useClock(mode = "time") {
  const now = ref(new Date());
  let timer;

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    clearInterval(timer);
  });

  const displayValue = computed(() => {
    if (mode === "date") {
      return now.value.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }

    const time = now.value.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
    const tz = now.value
      .toLocaleTimeString("en-US", { timeZoneName: "short" })
      .split(" ")
      .pop();
    return `${time} ${tz}`;
  });

  return { now, displayValue };
}

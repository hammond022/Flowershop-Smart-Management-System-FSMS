import { createApp } from "vue";
import App from "./App.vue";
import { auth, API_BASE } from "./auth.js";
import tooltip from "@/directives/tooltip";

import "./assets/css/global.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// ^^^ removed this for now since its interfering with accordions collapsing, no issues seen so far
import router from "./router";

auth.init();

const app = createApp(App);

app.directive("tooltip", tooltip);
app.use(router);
app.mount("#app");

// Handle logout when Electron app is closing
if (window.electronAPI && window.electronAPI.onBeforeQuit) {
  window.electronAPI.onBeforeQuit(() => {
    auth.logout();
  });
}

// Check database status on app launch - if database has users, redirect to login
router.isReady().then(async () => {
  try {
    const statusRes = await fetch(`${API_BASE}/onboarding/status`);
    if (statusRes.ok) {
      const statusData = await statusRes.json();
      // If database is not empty (has users) and user is not authenticated, go to login
      if (!statusData.isEmpty && !auth.isAuthenticated) {
        router.push({ name: "login" });
      }
    }
  } catch (error) {
    console.warn("Could not check database status on launch:", error);
  }
});

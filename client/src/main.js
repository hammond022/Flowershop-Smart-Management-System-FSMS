import { createApp } from "vue";
import App from "./App.vue";
import { auth } from "./auth.js";
import tooltip from "@/directives/tooltip";

import "./assets/css/global.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// ^^^ removed this for now since its interfering with accordions collapsing, no issues seen so far
import router from "./router";

const app = createApp(App);

app.directive("tooltip", tooltip);
app.use(router);
app.mount("#app");

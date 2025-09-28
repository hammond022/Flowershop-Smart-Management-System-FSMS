import { createApp } from "vue";
import App from "./App.vue";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// ^^^ removed this for now since its interfering with accordions collapsing, no issues seen so far
import router from "./router";

const app = createApp(App);

app.use(router);
app.mount("#app");

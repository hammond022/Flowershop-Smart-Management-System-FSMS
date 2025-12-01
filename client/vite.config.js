import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

const backendProxyTarget =
  process.env.VITE_BACKEND_PROXY || "http://localhost:3000";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/uploads": backendProxyTarget, // allows overriding via VITE_BACKEND_PROXY
    },
  },
});

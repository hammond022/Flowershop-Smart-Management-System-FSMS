import { contextBridge, ipcRenderer } from "electron";

const apiBaseUrl = process.env.API_BASE_URL || "";

contextBridge.exposeInMainWorld("electronAPI", {
  apiBaseUrl,
  getApiBaseUrl: () => apiBaseUrl,
  openExternal: (target) => ipcRenderer.invoke("app:open-external", target),
});

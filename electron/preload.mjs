import { contextBridge, ipcRenderer } from "electron";

const apiBaseUrl = process.env.API_BASE_URL || "";

contextBridge.exposeInMainWorld("electronAPI", {
  apiBaseUrl,
  getApiBaseUrl: () => apiBaseUrl,
  openExternal: (target) => ipcRenderer.invoke("app:open-external", target),
  logout: () => ipcRenderer.invoke("app:logout"),
  onBeforeQuit: (callback) => ipcRenderer.on("app:before-quit", callback),
});

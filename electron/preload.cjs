const { contextBridge, ipcRenderer } = require("electron");

function getApiBaseUrl() {
  return process.env.API_BASE_URL || "";
}

contextBridge.exposeInMainWorld("electronAPI", {
  apiBaseUrl: getApiBaseUrl(),
  getApiBaseUrl,
  openExternal: (target) => ipcRenderer.invoke("app:open-external", target),
  logout: () => ipcRenderer.invoke("app:logout"),
  onBeforeQuit: (callback) => ipcRenderer.on("app:before-quit", callback),
});

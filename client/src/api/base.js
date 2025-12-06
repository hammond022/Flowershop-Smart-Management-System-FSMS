const FALLBACK_API_BASE = "http://localhost:3000/api";

const safeWindow = typeof window !== "undefined" ? window : undefined;

function readElectronBase() {
  if (!safeWindow?.electronAPI) {
    return undefined;
  }

  if (typeof safeWindow.electronAPI.getApiBaseUrl === "function") {
    return safeWindow.electronAPI.getApiBaseUrl();
  }

  if (typeof safeWindow.electronAPI.apiBaseUrl === "string") {
    return safeWindow.electronAPI.apiBaseUrl;
  }

  return undefined;
}

export function resolveApiBaseUrl() {
  const electronBase = readElectronBase();
  if (electronBase) {
    return electronBase;
  }

  if (
    typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_API_BASE_URL
  ) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  return FALLBACK_API_BASE;
}

export const API_BASE_URL = resolveApiBaseUrl();

export function resolveBackendOrigin() {
  try {
    const apiUrl = new URL(resolveApiBaseUrl());
    return apiUrl.origin;
  } catch {
    return FALLBACK_API_BASE.replace(/\/api$/, "");
  }
}

export function resolveUploadsBaseUrl() {
  const origin = resolveBackendOrigin();
  return `${origin}/uploads`;
}

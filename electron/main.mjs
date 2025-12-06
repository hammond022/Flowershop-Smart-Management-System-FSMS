import { app, BrowserWindow, ipcMain, shell } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const isDev = !app.isPackaged;
const APP_TITLE = "FlowerShop Smart Management System";
const DEV_ICON_PATH = path.join(
  projectRoot,
  "client",
  "src",
  "assets",
  "icons",
  "icon.ico"
);

function getIconPath() {
  if (app.isPackaged) {
    const packagedIcon = path.join(process.resourcesPath, "icon.ico");
    if (fs.existsSync(packagedIcon)) {
      return packagedIcon;
    }
  }
  return DEV_ICON_PATH;
}

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = isDev ? "development" : "production";
}

let backendServer;
let backendPort;
let dataPaths;
let isQuitting = false;

const fsp = fs.promises;

function resolveAssetPath(...segments) {
  return path.join(projectRoot, ...segments);
}

async function pathExists(target) {
  try {
    await fsp.access(target);
    return true;
  } catch {
    return false;
  }
}

async function copyFileIfMissing(src, dest) {
  if (!(await pathExists(src)) || (await pathExists(dest))) {
    return;
  }

  await fsp.mkdir(path.dirname(dest), { recursive: true });
  await fsp.copyFile(src, dest);
}

async function copyDirectoryIfMissing(src, dest) {
  if (!(await pathExists(src))) {
    return;
  }

  await fsp.mkdir(dest, { recursive: true });
  const entries = await fsp.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(src, entry.name);
    const targetPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectoryIfMissing(sourcePath, targetPath);
    } else if (!(await pathExists(targetPath))) {
      await copyFileIfMissing(sourcePath, targetPath);
    }
  }
}

async function ensurePersistentData() {
  if (dataPaths) {
    return dataPaths;
  }

  const userDataDir = app.getPath("userData");
  const dbPath = path.join(userDataDir, "db.json");
  const uploadsDir = path.join(userDataDir, "uploads");
  const dataDir = path.join(userDataDir, "data");

  await copyFileIfMissing(resolveAssetPath("server", "db.json"), dbPath);
  await copyDirectoryIfMissing(resolveAssetPath("uploads"), uploadsDir);
  await copyDirectoryIfMissing(resolveAssetPath("server", "data"), dataDir);

  dataPaths = { dbPath, uploadsDir, dataDir };
  return dataPaths;
}

async function bootstrapBackend() {
  if (backendServer) {
    return;
  }

  const { dbPath, uploadsDir, dataDir } = await ensurePersistentData();

  process.env.DB_PATH = dbPath;
  process.env.UPLOADS_DIR = uploadsDir;
  process.env.DATA_DIR = dataDir;

  const { startServer } = await import("../server/server.js");
  backendServer = await startServer({ port: 0 });
  const address = backendServer.address();
  const actualPort =
    typeof address === "object" && address?.port
      ? address.port
      : Number(process.env.SERVER_PORT) || 3000;
  backendPort = actualPort;
  process.env.API_BASE_URL = `http://127.0.0.1:${actualPort}/api`;
}

async function createWindow() {
  await bootstrapBackend();

  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    title: APP_TITLE,
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.setTitle(APP_TITLE);

  // Handle window closing to trigger logout
  mainWindow.on("close", (event) => {
    mainWindow.webContents.send("app:before-quit");
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = path.join(
      resolveAssetPath("client", "dist"),
      "index.html"
    );
    await mainWindow.loadFile(indexHtml);
  }
}

async function stopBackend() {
  if (!backendServer) {
    return;
  }

  await new Promise((resolve, reject) => {
    backendServer.close((err) => {
      backendServer = undefined;
      backendPort = undefined;
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

app
  .whenReady()
  .then(async () => {
    await createWindow();

    app.on("activate", async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow();
      }
    });
  })
  .catch((error) => {
    console.error("Failed to start application", error);
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async (event) => {
  if (!backendServer || isQuitting) {
    return;
  }

  event.preventDefault();
  isQuitting = true;
  try {
    await stopBackend();
  } finally {
    app.exit();
  }
});

ipcMain.handle("app:get-api-base-url", () => process.env.API_BASE_URL || "");
ipcMain.handle("app:open-external", (_event, target) => {
  if (typeof target === "string" && target.length > 0) {
    shell.openExternal(target);
  }
});

ipcMain.handle("app:logout", () => {
  // Handler for logout triggered on window close
  return true;
});

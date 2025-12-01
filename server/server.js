import express from "express";
import cors from "cors";
import { pathToFileURL } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import PATHS from "./config/paths.js";
import { basicAuth } from "./middleware/auth.js";
import usersRouter from "./routes/api/users.js";
import itemsRouter from "./routes/api/items.js";
import ordersRouter from "./routes/api/orders.js";
import purchaseOrdersRouter from "./routes/api/purchaseOrders.js";
import bouquetsRouter from "./routes/api/bouquets.js";
import customBouquetsRouter from "./routes/api/customBouquets.js";
import photoUploadRoute from "./routes/api/photoUploadRoute.js";
import databaseRouter from "./routes/api/database.js";
import onboardingRouter from "./routes/api/onboarding.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(PATHS.uploads));
app.use("/api/upload", photoUploadRoute);

const adapter = new JSONFile(PATHS.db);
export const db = new Low(adapter, { users: [], items: [] });
await db.read();

if (!db.data.users) {
  db.data.users = [];
  await db.write();
}

app.use("/api/onboarding", onboardingRouter);
app.use(basicAuth);
app.use("/api/database", databaseRouter);
app.use("/api/bouquets", bouquetsRouter);
app.use("/api/custom-bouquets", customBouquetsRouter);
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/purchaseOrders", purchaseOrdersRouter);

let serverHandle = null;

function normalizePort(value) {
  const portNumber = typeof value === "string" ? parseInt(value, 10) : value;
  if (Number.isNaN(portNumber) || portNumber <= 0) {
    return undefined;
  }
  return portNumber;
}

export async function startServer(options = {}) {
  if (serverHandle) {
    return serverHandle;
  }

  const port =
    normalizePort(options.port) ||
    normalizePort(process.env.SERVER_PORT) ||
    3000;
  const host = options.host || process.env.SERVER_HOST || "127.0.0.1";

  return new Promise((resolve, reject) => {
    const instance = app.listen(port, host, () => {
      serverHandle = instance;
      const address = instance.address();
      const actualPort =
        typeof address === "string" ? port : address?.port || port;
      console.log(`Server running at http://${host}:${actualPort}`);
      resolve(instance);
    });

    instance.on("error", (error) => {
      console.error("Failed to start server", error);
      reject(error);
    });
  });
}

export async function stopServer() {
  if (!serverHandle) {
    return;
  }

  await new Promise((resolve, reject) => {
    serverHandle.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  serverHandle = null;
}

const isDirectRun =
  process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun) {
  startServer().catch((error) => {
    console.error("Server failed to start", error);
    process.exitCode = 1;
  });
}

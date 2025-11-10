import express from "express";
import cors from "cors";
import path from "path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { basicAuth } from "./middleware/auth.js";
import usersRouter from "./routes/api/users.js";
import itemsRouter from "./routes/api/items.js";
import ordersRouter from "./routes/api/orders.js";
import purchaseOrdersRouter from "./routes/api/purchaseOrders.js";
import bouquetsRouter from "./routes/api/bouquets.js";
import photoUploadRoute from "./routes/api/photoUploadRoute.js";

// i apologize for this monstrosity
// photo upload

const app = express();
app.use(cors());
app.use(express.json());
//waduheck
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/upload", photoUploadRoute);

// Lowdb setup
const adapter = new JSONFile("db.json");
export const db = new Low(adapter, { users: [], items: [] });
await db.read();

app.use(basicAuth);

// Mount routers
app.use("/api/bouquets", bouquetsRouter);
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/purchaseOrders", purchaseOrdersRouter);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

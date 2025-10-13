import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

import usersRouter from "./routes/api/users.js";
import itemsRouter from "./routes/api/items.js";
import ordersRouter from "./routes/api/orders.js";
import purchaseOrdersRouter from "./routes/api/purchaseOrders.js";

const app = express();
app.use(express.json());
app.use(cors());

// Lowdb setup
const adapter = new JSONFile("db.json");
export const db = new Low(adapter, { users: [], items: [] });
await db.read();

// Mount routers
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/purchaseOrders", purchaseOrdersRouter);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

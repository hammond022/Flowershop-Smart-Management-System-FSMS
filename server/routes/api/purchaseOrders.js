import express from "express";
import { db } from "../../server.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const purchaseOrders = db.data.purchaseOrders || [];
    res.json(purchaseOrders);
  } catch (err) {
    console.error("Error fetching purchase orders:", err);
    res.status(500).json({ error: "Server error fetching purchase orders" });
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const po = (db.data.purchaseOrders || []).find((p) => p.id === id);
    if (!po) return res.status(404).json({ error: "Purchase order not found" });
    res.json(po);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching purchase order" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { supplier, items } = req.body;

    if (!supplier || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Supplier and at least one item are required",
      });
    }

    const newPO = {
      id: Date.now(),
      supplier,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        costPerUnit: item.costPerUnit,
        subtotal: item.qty * item.costPerUnit,
      })),
      totalCost: items.reduce(
        (sum, item) => sum + item.qty * item.costPerUnit,
        0
      ),
      createdAt: new Date().toISOString(),
    };

    if (!db.data.purchaseOrders) db.data.purchaseOrders = [];
    db.data.purchaseOrders.push(newPO);
    await db.write();

    res.status(201).json(newPO);
  } catch (err) {
    console.error("Error creating purchase order:", err);
    res.status(500).json({ error: "Server error creating purchase order" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const existing = db.data.purchaseOrders?.find((p) => p.id === id);
    if (!existing)
      return res.status(404).json({ error: "Purchase order not found" });

    db.data.purchaseOrders = db.data.purchaseOrders.filter((p) => p.id !== id);
    await db.write();

    res.json({ message: "Purchase order deleted", deletedPO: existing });
  } catch (err) {
    console.error("Error deleting purchase order:", err);
    res.status(500).json({ error: "Server error deleting purchase order" });
  }
});

export default router;

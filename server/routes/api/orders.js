import express from "express";
import { db } from "../../server.js";

const router = express.Router();

// GET all orders
router.get("/", (req, res) => {
  try {
    res.json(db.data.orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error finding all orders" });
  }
});

//GET order by id
router.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const order = db.data.orders.find((u) => u.id === id);
    if (!order) return res.status(404).send("Not found");
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error finding order" });
  }
});

// CREATE order
router.post("/", async (req, res) => {
  try {
    // orderStart, orderEnd should be confined to a date, orderStatus should be confined to Completed, Return, Draft... idk
    const {
      orderStart,
      orderEnd,
      orderStatus,
      selectedFlowers,
      actionHistory,
    } = req.body;

    if (!orderStart || !orderStatus) {
      return res.status(400).json({
        error: "orderStart, orderEnd, and orderStatus are required",
      });
    }

    const newOrder = {
      id: Date.now(),
      orderStart,
      orderEnd,
      orderStatus,
      selectedFlowers: Array.isArray(selectedFlowers) ? selectedFlowers : [],
      actionHistory: Array.isArray(actionHistory) ? actionHistory : [],
      createdAt: new Date().toISOString(),
    };

    db.data.orders.push(newOrder);
    await db.write();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating order" });
  }
});

export default router;

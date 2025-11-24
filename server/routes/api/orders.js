// this route does not check the integretity of the requests

import express from "express";
import { db } from "../../server.js";
import { basicAuth } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/roles.js";

const router = express.Router();

// GET all orders
router.get("/", (req, res) => {
  try {
    const { status } = req.query;
    let orders = db.data.orders;

    if (status) {
      orders = orders.filter(
        (order) => order.orderStatus.toLowerCase() === status.toLowerCase()
      );
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching orders" });
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
router.post(
  "/",
  basicAuth,
  requirePermission("Orders", "canCreate"),
  async (req, res) => {
    try {
      // orderStart, orderEnd should be confined to a date, orderStatus should be confined to Completed, Return, Draft... idk
      const {
        orderStart,
        orderEnd,
        orderStatus,
        selectedFlowers,
        discounts,
        mop,
        actionHistory,
        amountPaid,
        change,
        dedicationMessage,
        customerName,
        customerContact,
        refId,
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
        discounts,
        mop,
        actionHistory: Array.isArray(actionHistory) ? actionHistory : [],
        createdAt: new Date().toISOString(),
        amountPaid: amountPaid || 0,
        change: change || 0,
        dedicationMessage: dedicationMessage?.substring(0, 200) || "",
        customerName,
        customerContact,
        refId,
      };

      db.data.orders.push(newOrder);
      await db.write();
      res.status(201).json(newOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error creating order" });
    }
  }
);

//UPDATE order by ID
router.put(
  "/:id",
  basicAuth,
  requirePermission("Orders", "canUpdate"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const order = db.data.orders.find((o) => o.id === id);

      if (!order) return res.status(404).json({ error: "Order not found" });

      const {
        orderStart,
        orderEnd,
        orderStatus,
        selectedFlowers,
        discounts,
        mop,
        actionHistory,
        amountPaid,
        change,
        dedicationMessage,
        customerName,
        customerContact,
        refId,
      } = req.body;

      // Only update fields that are provided in the request
      if (orderStart) order.orderStart = orderStart;
      if (orderEnd) order.orderEnd = orderEnd;
      if (orderStatus) order.orderStatus = orderStatus;
      if (selectedFlowers) order.selectedFlowers = selectedFlowers;
      if (discounts) order.discounts = discounts;
      if (mop) order.mop = mop;
      if (actionHistory) order.actionHistory = actionHistory;
      if (amountPaid !== undefined) order.amountPaid = amountPaid;
      if (change !== undefined) order.change = change;
      if (dedicationMessage) order.dedicationMessage = dedicationMessage;
      if (customerName) order.customerName = customerName;
      if (customerContact) order.customerContact = customerContact;
      if (refId) order.refId = refId;
      await db.write();

      res.json({ message: "Order updated successfully", order });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error updating order" });
    }
  }
);

// DELETE order by ID
router.delete(
  "/:id",
  basicAuth,
  requirePermission("Orders", "canDelete"),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const order = db.data.orders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ error: "Order not found" });

      db.data.orders = db.data.orders.filter((o) => o.id !== id);
      await db.write();

      res.json({
        message: "Order deleted successfully",
        deletedOrder: order,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error deleting order" });
    }
  }
);

export default router;

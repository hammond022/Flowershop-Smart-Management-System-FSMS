import express from "express";
import { db } from "../../server.js";

const router = express.Router();

// Initialize customBouquets if it doesn't exist
function ensureCustomBouquets() {
  if (!db.data.customBouquets) {
    db.data.customBouquets = [];
  }
}

// Get all custom bouquets
router.get("/", async (req, res) => {
  try {
    await db.read();
    ensureCustomBouquets();
    res.json(db.data.customBouquets || []);
  } catch (err) {
    console.error("Failed to fetch custom bouquets:", err);
    res.status(500).json({ error: "Failed to fetch custom bouquets" });
  }
});

// Get a specific custom bouquet by ID
router.get("/:id", async (req, res) => {
  try {
    await db.read();
    ensureCustomBouquets();
    const bouquet = db.data.customBouquets.find((b) => b.id == req.params.id);
    if (!bouquet) {
      return res.status(404).json({ error: "Bouquet not found" });
    }
    res.json(bouquet);
  } catch (err) {
    console.error("Failed to fetch bouquet:", err);
    res.status(500).json({ error: "Failed to fetch bouquet" });
  }
});

// Create a new custom bouquet
router.post("/", async (req, res) => {
  try {
    const { name, description, price, items } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Bouquet name is required" });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Valid price is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one item must be selected" });
    }

    // Validate items
    for (const item of items) {
      if (
        !item.itemId ||
        !item.itemName ||
        !item.quantity ||
        item.quantity <= 0
      ) {
        return res.status(400).json({ error: "Invalid item data" });
      }
    }

    await db.read();
    ensureCustomBouquets();

    const newBouquet = {
      id: Date.now(),
      name: name.trim(),
      description: description ? description.trim() : "",
      price,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.data.customBouquets.push(newBouquet);
    await db.write();

    res.status(201).json(newBouquet);
  } catch (err) {
    console.error("Failed to create custom bouquet:", err);
    res.status(500).json({ error: "Failed to create custom bouquet" });
  }
});

// Update a custom bouquet
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, items } = req.body;

    // Validation
    if (name && !name.trim()) {
      return res.status(400).json({ error: "Bouquet name cannot be empty" });
    }

    if (price !== undefined) {
      if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "Valid price is required" });
      }
    }

    if (items) {
      if (!Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "At least one item must be selected" });
      }

      // Validate items
      for (const item of items) {
        if (
          !item.itemId ||
          !item.itemName ||
          !item.quantity ||
          item.quantity <= 0
        ) {
          return res.status(400).json({ error: "Invalid item data" });
        }
      }
    }

    await db.read();
    ensureCustomBouquets();

    const bouquetIndex = db.data.customBouquets.findIndex(
      (b) => b.id == req.params.id
    );
    if (bouquetIndex === -1) {
      return res.status(404).json({ error: "Bouquet not found" });
    }

    const bouquet = db.data.customBouquets[bouquetIndex];

    // Update only provided fields
    if (name) bouquet.name = name.trim();
    if (description !== undefined) bouquet.description = description.trim();
    if (price !== undefined) bouquet.price = price;
    if (items) bouquet.items = items;

    bouquet.updatedAt = new Date().toISOString();

    db.data.customBouquets[bouquetIndex] = bouquet;
    await db.write();

    res.json(bouquet);
  } catch (err) {
    console.error("Failed to update custom bouquet:", err);
    res.status(500).json({ error: "Failed to update custom bouquet" });
  }
});

// Delete a custom bouquet
router.delete("/:id", async (req, res) => {
  try {
    await db.read();
    ensureCustomBouquets();

    const bouquetIndex = db.data.customBouquets.findIndex(
      (b) => b.id == req.params.id
    );
    if (bouquetIndex === -1) {
      return res.status(404).json({ error: "Bouquet not found" });
    }

    const deletedBouquet = db.data.customBouquets.splice(bouquetIndex, 1)[0];
    await db.write();

    res.json({
      success: true,
      message: "Bouquet deleted",
      id: deletedBouquet.id,
    });
  } catch (err) {
    console.error("Failed to delete custom bouquet:", err);
    res.status(500).json({ error: "Failed to delete custom bouquet" });
  }
});

export default router;

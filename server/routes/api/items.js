import express from "express";
import { db } from "../../server.js";

const router = express.Router();

// GET all items
router.get("/", (req, res) => {
  res.json(db.data.items);
});

//GET item by id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = db.data.items.find((u) => u.id === id);
  if (!item) return res.status(404).send("Not found");
  res.json(item);
});

// CREATE item
router.post("/", async (req, res) => {
  const {
    name,
    stock,
    price,
    cost,
    category,
    description,
    tags = [],
  } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return res
      .status(400)
      .json({ error: "Name is required and must be a non-empty string." });
  }

  if (stock == null || !Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({
      error: "Stock is required and must be a non-negative integer.",
    });
  }

  if (price == null || typeof price !== "number" || price < 0) {
    return res
      .status(400)
      .json({ error: "Price is required and must be a non-negative number." });
  }

  if (!category || typeof category !== "string" || !category.trim()) {
    return res
      .status(400)
      .json({ error: "Category is required and must be a non-empty string." });
  }

  if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
    return res.status(400).json({ error: "Tags must be an array of strings." });
  }

  const exists = db.data.items.some(
    (item) => item.name && item.name.toLowerCase() === name.toLowerCase()
  );

  if (exists) {
    return res
      .status(409)
      .json({ error: "Item with this name already exists." });
  }

  const newItem = {
    id: Date.now(),
    name: name.trim(),
    stock,
    price,
    cost: cost ?? null,
    category,
    description: description?.trim() || "",
    tags,
  };

  db.data.items.push(newItem);
  await db.write();

  res.status(201).json(newItem);
});

// UPDATE item
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const item = db.data.items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  const allowedFields = [
    "name",
    "stock",
    "price",
    "cost",
    "category",
    "description",
    "tags",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      item[field] = req.body[field];
    }
  }

  await db.write();
  res.json(item);
});

// DELETE item
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  db.data.items = db.data.items.filter((i) => i.id !== id);
  await db.write();
  res.status(204).end();
});

export default router;

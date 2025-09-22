import express from "express";
import { db } from "../../server.js";

const router = express.Router();

// GET all users
router.get("/", (req, res) => {
  res.json(db.data.users);
});

// CREATE user
router.post("/", async (req, res) => {
  const newUser = { id: Date.now(), name: req.body.name };
  db.data.users.push(newUser);
  await db.write();
  res.status(201).json(newUser);
});

// UPDATE user
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = db.data.users.find((u) => u.id === id);
  if (!user) return res.status(404).send("Not found");
  user.name = req.body.name;
  await db.write();
  res.json(user);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  db.data.users = db.data.users.filter((u) => u.id !== id);
  await db.write();
  res.status(204).end();
});

export default router;

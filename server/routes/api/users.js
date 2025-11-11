// routes/api/users.js
import express from "express";
import { db } from "../../server.js";
import { basicAuth } from "../../middleware/auth.js";

const router = express.Router();

/**
 * 🔐 Return current authenticated user (for login verification)
 * Used by frontend: authentication.js → login()
 */
router.get("/me", basicAuth, (req, res) => {
  // Exclude password from response for security
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  await db.read();
  const user = db.data.users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

/**
 * 👥 Get all users
 * (You can protect this with admin permissions later if needed)
 */
router.get("/", (req, res) => {
  const users = db.data.users.map(({ password, ...rest }) => rest);
  res.json(users);
});

/**
 * ➕ Create new user
 * For now, this just adds a simple user; you can extend it with password hashing later.
 */
router.post("/", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Check for duplicate username
  const exists = db.data.users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    role: role || {
      Orders: { canCreate: false, canUpdate: false, canDelete: false },
      Items: { canCreate: false, canUpdate: false, canDelete: false },
      PurchaseOrders: { canCreate: false, canUpdate: false, canDelete: false },
    },
  };

  db.data.users.push(newUser);
  await db.write();

  // Exclude password in response
  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

/**
 * ✏️ Update user
 */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = db.data.users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  const { username, password, role } = req.body;

  if (username) user.username = username;
  if (password) user.password = password;
  if (role) user.role = role;

  await db.write();
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

/**
 * ❌ Delete user
 */
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  db.data.users = db.data.users.filter((u) => u.id !== id);
  await db.write();
  res.status(204).end();
});

export default router;

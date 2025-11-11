// routes/api/users.js
import express from "express";
import { db } from "../../server.js";
import { basicAuth } from "../../middleware/auth.js";

const router = express.Router();

router.get("/me", basicAuth, (req, res) => {
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

router.get("/", (req, res) => {
  const users = db.data.users.map(({ password, ...rest }) => rest);
  res.json(users);
});

router.post("/", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

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
      Orders: [
        { key: "create", label: "Create", enabled: false },
        { key: "delete", label: "Delete", enabled: false },
      ],
      Items: [
        { key: "create", label: "Create", enabled: false },
        { key: "delete", label: "Delete", enabled: false },
        { key: "update", label: "Update", enabled: false },
      ],
      "Purchase Orders": [{ key: "create", label: "Create", enabled: false }],
      admin: {
        isAdmin: false,
      },
    },
  };

  db.data.users.push(newUser);
  await db.write();

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

router.put("/:id", basicAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { username, password, role } = req.body;
  if (req.user.id === id && role) {
    if (role.admin) {
      return res
        .status(403)
        .json({ error: "You cannot edit your own permissions." });
    } // Note: This still allows users to edit their own non-admin roles.
  }

  const user = db.data.users.find((u) => u.id === id);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (username) user.username = username;
  if (password) user.password = password;
  if (role) user.role = role;

  await db.write();
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  db.data.users = db.data.users.filter((u) => u.id !== id);
  await db.write();
  res.status(204).end();
});

export default router;

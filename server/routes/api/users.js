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

router.post("/", basicAuth, async (req, res) => {
  if (!req.user?.role?.admin?.isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters" });
  }

  await db.read();
  const exists = db.data.users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const permissionDefaults = {
    Orders: { canCreate: false, canDelete: false, canUpdate: false },
    Items: { canCreate: false, canDelete: false, canUpdate: false },
    PurchaseOrders: { canCreate: false },
    admin: { isAdmin: false },
  };

  const finalRole = {
    Orders: { ...permissionDefaults.Orders, ...(role?.Orders || {}) },
    Items: { ...permissionDefaults.Items, ...(role?.Items || {}) },
    PurchaseOrders: {
      ...permissionDefaults.PurchaseOrders,
      ...(role?.PurchaseOrders || {}),
    },
    admin: { ...permissionDefaults.admin, ...(role?.admin || {}) },
  };

  const newUser = {
    id: Date.now(),
    username,
    password,
    role: finalRole,
  };

  db.data.users.push(newUser);
  await db.write();

  const { password: _, ...safeUser } = newUser;
  res.status(201).json(safeUser);
});

router.put("/:id", basicAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { username, password, role } = req.body;

  if (req.user.id !== id && !req.user?.role?.admin?.isAdmin) {
    return res.status(403).json({ error: "Permission denied" });
  }

  await db.read();
  const user = db.data.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (username && username !== user.username) {
    const exists = db.data.users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.id !== id
    );
    if (exists) {
      return res.status(409).json({ error: "Username already exists" });
    }
    user.username = username;
  }

  if (password) {
    if (typeof password !== "string" || password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    user.password = password;
  }

  if (role) {
    if (!req.user?.role?.admin?.isAdmin) {
      return res
        .status(403)
        .json({ error: "Permission denied to change role" });
    }

    if (req.user.id === id && role.admin?.isAdmin === false) {
      return res
        .status(403)
        .json({ error: "Cannot remove your own admin privileges" });
    }

    user.role = {
      Orders: {
        canCreate: false,
        canDelete: false,
        canUpdate: false,
        ...(role.Orders || {}),
      },
      Items: {
        canCreate: false,
        canDelete: false,
        canUpdate: false,
        ...(role.Items || {}),
      },
      PurchaseOrders: { canCreate: false, ...(role.PurchaseOrders || {}) },
      admin: { isAdmin: false, ...(role.admin || {}) },
    };
  }

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

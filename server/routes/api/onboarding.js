import express from "express";
import { db } from "../../server.js";

const router = express.Router();

// Check if database is empty (no users)
router.get("/status", async (req, res) => {
  try {
    await db.read();
    const isEmpty = !db.data.users || db.data.users.length === 0;
    res.json({
      isEmpty,
      userCount: db.data.users?.length || 0,
      message: isEmpty
        ? "Database is empty, onboarding required"
        : "Database initialized",
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ message: "Failed to check database status" });
  }
});

// Create first user without authentication (only if database is empty)
router.post("/create-first-user", async (req, res) => {
  try {
    await db.read();

    // Check if database is empty
    if (db.data.users && db.data.users.length > 0) {
      return res.status(403).json({
        error:
          "Database already initialized. Cannot create user without authentication.",
      });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    // Enforce strong password requirements
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters",
      });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least 1 lowercase letter",
      });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least 1 uppercase letter",
      });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least 1 digit",
      });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        error: "Password must contain at least 1 special character",
      });
    }

    // Check username uniqueness (just in case)
    const exists =
      db.data.users &&
      db.data.users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );
    if (exists) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    // Initialize users array if it doesn't exist
    if (!db.data.users) {
      db.data.users = [];
    }

    // Create first user with admin privileges
    const newUser = {
      id: Date.now(),
      username,
      password,
      role: {
        Orders: { canCreate: true, canDelete: true, canUpdate: true },
        Items: { canCreate: true, canDelete: true, canUpdate: true },
        PurchaseOrders: { canCreate: true },
        admin: { isAdmin: true },
      },
    };

    db.data.users.push(newUser);
    await db.write();

    // Return user without password
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      user: safeUser,
      message: "First user created successfully with admin privileges",
    });
  } catch (error) {
    console.error("First user creation error:", error);
    res.status(500).json({
      message: "Failed to create first user",
      error: error.message,
    });
  }
});

export default router;

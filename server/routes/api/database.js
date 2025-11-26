import express from "express";
import { requirePermission } from "../../middleware/roles.js";
import { db } from "../../server.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Middleware to verify admin and password
function verifyAdminPassword(req, res, next) {
  if (!req.user?.role?.admin?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }

  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  // Verify password matches current user's password
  if (password !== req.user.password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  next();
}

// Export entire database
router.post("/export", verifyAdminPassword, async (req, res) => {
  try {
    await db.read();
    const dbData = db.data;

    // Create a clean export without sensitive data (optional - remove passwords if desired)
    const exportData = {
      ...dbData,
      users: dbData.users.map((user) => ({
        ...user,
        // Keep passwords for import purposes, but document that this should be handled securely
      })),
    };

    res.json({
      success: true,
      data: exportData,
      timestamp: new Date().toISOString(),
      version: "1.0",
    });
  } catch (error) {
    console.error("Export failed:", error);
    res.status(500).json({ message: "Export failed", error: error.message });
  }
});

// Import entire database
router.post("/import", verifyAdminPassword, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "No data provided for import" });
    }

    // Validate that the imported data has the expected structure
    if (
      typeof data !== "object" ||
      !Array.isArray(data.users) ||
      !Array.isArray(data.items)
    ) {
      return res.status(400).json({
        message:
          "Invalid database format. Must contain users and items arrays.",
      });
    }

    // Replace database with imported data
    db.data = data;
    await db.write();

    res.json({
      success: true,
      message: "Database imported successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Import failed:", error);
    res.status(500).json({ message: "Import failed", error: error.message });
  }
});

// Validate database integrity before import (preview)
router.post("/validate", verifyAdminPassword, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "No data provided" });
    }

    let isValid = true;
    let issues = [];

    if (!Array.isArray(data.users)) {
      isValid = false;
      issues.push("users must be an array");
    }

    if (!Array.isArray(data.items)) {
      isValid = false;
      issues.push("items must be an array");
    }

    // Check for required fields in users
    if (Array.isArray(data.users)) {
      data.users.forEach((user, idx) => {
        if (!user.username || !user.password) {
          issues.push(`User at index ${idx} missing username or password`);
        }
      });
    }

    res.json({
      isValid,
      issues,
      userCount: Array.isArray(data.users) ? data.users.length : 0,
      itemCount: Array.isArray(data.items) ? data.items.length : 0,
    });
  } catch (error) {
    console.error("Validation failed:", error);
    res
      .status(500)
      .json({ message: "Validation failed", error: error.message });
  }
});

export default router;

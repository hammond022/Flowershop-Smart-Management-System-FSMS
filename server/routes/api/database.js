import express from "express";
import { requirePermission } from "../../middleware/roles.js";
import { db } from "../../server.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import path from "path";
import archiver from "archiver";
import multer from "multer";
import unzipper from "unzipper";
import PATHS from "../../config/paths.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

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

    // Check if client wants to include images
    const includeImages = req.body.includeImages !== false;

    if (includeImages) {
      // Create a ZIP archive with database and images
      const uploadsDir = PATHS.uploads;

      if (fs.existsSync(uploadsDir)) {
        res.setHeader("Content-Type", "application/zip");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="database_export_${
            new Date().toISOString().split("T")[0]
          }.zip"`
        );

        const archive = archiver("zip", { zlib: { level: 9 } });

        archive.on("error", (err) => {
          console.error("Archive error:", err);
          res
            .status(500)
            .json({ message: "Failed to create archive", error: err.message });
        });

        archive.pipe(res);

        // Add database.json to archive
        archive.append(JSON.stringify(exportData, null, 2), {
          name: "database.json",
        });

        // Add all images from uploads folder
        const files = fs.readdirSync(uploadsDir);
        files.forEach((file) => {
          const filePath = path.join(uploadsDir, file);
          archive.file(filePath, { name: `images/${file}` });
        });

        await archive.finalize();
      } else {
        // No uploads directory, just send database
        res.json({
          success: true,
          data: exportData,
          timestamp: new Date().toISOString(),
          version: "1.0",
          hasImages: false,
        });
      }
    } else {
      // Just export database without images
      res.json({
        success: true,
        data: exportData,
        timestamp: new Date().toISOString(),
        version: "1.0",
      });
    }
  } catch (error) {
    console.error("Export failed:", error);
    res.status(500).json({ message: "Export failed", error: error.message });
  }
});

// Import entire database with optional images from ZIP
router.post(
  "/import",
  upload.single("file"),
  verifyAdminPassword,
  async (req, res) => {
    try {
      const { data, includeImages } = req.body;
      let importedData = data;

      // Check if file was uploaded (ZIP with images)
      if (req.file) {
        try {
          // Parse the ZIP file
          const zipData = req.file.buffer;
          const uploadsDir = PATHS.uploads;

          // Ensure uploads directory exists
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          // Extract ZIP contents
          const entries = await unzipper.Open.buffer(zipData);

          for (const entry of Object.values(entries.files)) {
            // Extract database.json
            if (entry.path === "database.json") {
              const jsonContent = await entry.buffer();
              importedData = JSON.parse(jsonContent.toString());
            }
            // Extract images
            else if (
              entry.path.startsWith("images/") &&
              !entry.path.endsWith("/")
            ) {
              const filename = path.basename(entry.path);
              const imageBuffer = await entry.buffer();
              const filePath = path.join(uploadsDir, filename);
              fs.writeFileSync(filePath, imageBuffer);
            }
          }
        } catch (zipError) {
          console.error("ZIP extraction error:", zipError);
          return res.status(400).json({
            message: "Invalid ZIP file format",
            error: zipError.message,
          });
        }
      } else if (typeof data === "string") {
        // Handle JSON string format
        importedData = JSON.parse(data);
      }

      if (!importedData) {
        return res.status(400).json({ message: "No data provided for import" });
      }

      // Validate that the imported data has the expected structure
      if (
        typeof importedData !== "object" ||
        !Array.isArray(importedData.users) ||
        !Array.isArray(importedData.items)
      ) {
        return res.status(400).json({
          message:
            "Invalid database format. Must contain users and items arrays.",
        });
      }

      // Replace database with imported data
      db.data = importedData;
      await db.write();

      res.json({
        success: true,
        message: "Database imported successfully",
        imagesIncluded: !!req.file,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Import failed:", error);
      res.status(500).json({ message: "Import failed", error: error.message });
    }
  }
);

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

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import PATHS from "../../config/paths.js";

const router = express.Router();

// ✅ Use same folder as server static middleware
const uploadDir = PATHS.uploads;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({
    filePath,
    fileUrl: `${req.protocol}://${req.get("host")}${filePath}`,
  });
});

export default router;

import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { db } from "../../server.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const TOKEN_EXPIRES_IN = "1h";

// Mailer (optional) - use Gmail App Password or OAuth2 if configured via env
let mailer = null;
if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
  mailer = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}
// qzwa beam xdml psaj
function hashPassword(password, saltBase64) {
  const salt = Buffer.from(saltBase64, "base64");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256");
  return hash.toString("base64");
}

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role = "cashier" } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email and password are required" });
  }

  const exists = (db.data.users || []).some(
    (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const salt = crypto.randomBytes(16).toString("base64");
  const passwordHash = hashPassword(password, salt);

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    salt,
    role,
    createdAt: new Date().toISOString(),
  };

  if (!db.data.users) db.data.users = [];
  db.data.users.push(newUser);
  await db.write();

  const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  res.status(201).json({ token, user: safeUser });
});

// Login (supports email or name)
router.post("/login", (req, res) => {
  const { email, password, identifier } = req.body;
  const id = (email || identifier || "").toString().trim();
  if (!id || !password) return res.status(400).json({ error: "identifier (email or name) and password required" });

  let user;
  if (id.includes("@")) {
    user = (db.data.users || []).find((u) => u.email === id.toLowerCase());
  } else {
    // match by name (case-insensitive)
    user = (db.data.users || []).find((u) => u.name && u.name.toLowerCase() === id.toLowerCase());
  }
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const candidateHash = hashPassword(password, user.salt);

  const a = Buffer.from(candidateHash, "base64");
  const b = Buffer.from(user.passwordHash, "base64");
  // safe compare length first
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRES_IN,
  });

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ token, user: safeUser });
});

// Forgot password - create a reset token (no email sending here)
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "email required" });

    const user = (db.data.users || []).find((u) => u.email === email.toLowerCase());

    // Always respond with same message to avoid leaking user existence
    const message = "If an account exists for this email, you'll receive instructions to reset the password.";

    if (!user) {
      return res.json({ message });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetToken = resetToken;
    user.resetExpires = resetExpires;
    await db.write();

    // In a real app: send email containing reset link with token
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset?token=${resetToken}`;

    if (mailer) {
      try {
        await mailer.sendMail({
          from: `"Flowershop" <${process.env.GMAIL_USER}>`,
          to: user.email,
          subject: "Password reset instructions",
          text: `Reset your password using this link: ${resetUrl}`,
          html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. The link expires in 1 hour.</p>`,
        });
        return res.json({ message });
      } catch (err) {
        console.error("Error sending reset email:", err);
        // Fall back to returning token for dev debugging
        return res.json({ message, resetToken });
      }
    }

    // No mailer configured — log token and return it for development
    console.log(`Reset token for ${user.email}: ${resetToken}`);
    return res.json({ message, resetToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset password using token
router.post("/reset", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: "token and password required" });

    const user = (db.data.users || []).find((u) => u.resetToken === token && u.resetExpires && u.resetExpires > Date.now());
    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    const salt = crypto.randomBytes(16).toString("base64");
    const passwordHash = hashPassword(password, salt);

    user.salt = salt;
    user.passwordHash = passwordHash;
    delete user.resetToken;
    delete user.resetExpires;

    await db.write();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

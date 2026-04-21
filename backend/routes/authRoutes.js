import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

const EMAIL_ENABLED = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

/* ─── REGISTER ─────────────────────────────────────── */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (EMAIL_ENABLED) {
      /* ── Email verification flow ── */
      const verificationToken = crypto.randomBytes(32).toString("hex");
      await User.create({ name, email, password: hashedPassword, verificationToken, isVerified: false });

      const verifyLink = `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/verify/${verificationToken}`;

      await sendEmail(
        email,
        "Verify your AI Wear account",
        `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;background:#0f0c29;color:#fff;">
          <h2 style="color:#a855f7">Welcome to AI Wear 👋</h2>
          <p>Hi <strong>${name}</strong>, thanks for signing up!</p>
          <p>Click the button below to verify your email address:</p>
          <a href="${verifyLink}" style="display:inline-block;margin:16px 0;padding:12px 28px;background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">
            Verify Email
          </a>
          <p style="color:#aaa;font-size:13px;">Link expires in 24 hours.</p>
        </div>
        `
      );

      return res.json({ success: true, message: "Registration successful. Check your email to verify your account." });

    } else {
      /* ── No email configured: auto-verify and log in immediately ── */
      console.log("ℹ️  Email not configured — auto-verifying new user:", email);
      const user = await User.create({ name, email, password: hashedPassword, isVerified: true, verificationToken: null });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return res.json({
        success: true,
        autoLogin: true,
        message: "Registration successful!",
        token,
        user: { id: user._id, name: user.name, email: user.email },
      });
    }

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
});

/* ─── VERIFY EMAIL ──────────────────────────────────── */
router.get("/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user)
      return res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0f0c29;color:#fff"><h2>❌ Invalid or expired link</h2></body></html>`);

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

res.send(`<html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0f0c29;color:#fff"><h2>✅ Email verified!</h2><p>You can now <a href="${process.env.FRONTEND_URL}/login" style="color:#a855f7">log in</a>.</p></body></html>`);
  } catch {
    res.status(500).send("Verification failed");
  }
});

/* ─── LOGIN ─────────────────────────────────────────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "No account found with that email" });

    /* If email is NOT configured, skip verification gate */
    if (EMAIL_ENABLED && !user.isVerified)
      return res.status(400).json({ success: false, message: "Please verify your email first. Check your inbox." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

/* ─── GET CURRENT USER ──────────────────────────────── */
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password -verificationToken");

    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

export default router;

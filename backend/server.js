import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import tryonRoutes from "./routes/tryon.js";
import uploadRoute from "./routes/uploadRoute.js";

dotenv.config();

/* ─── Validate required env vars ────────────────────── */
const required = [
  "MONGO_URI",
  "JWT_SECRET",
  "RAPIDAPI_KEY",
  "CLOUD_NAME",
  "API_KEY",
  "API_SECRET"
];

const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌ Missing env vars:", missing.join(", "));
  console.error("   Copy .env.example to .env and fill in your values.");
  process.exit(1);
}

/* ─── Connect DB ─────────────────────────────────────── */
connectDB();

/* ─── App setup ─────────────────────────────────────── */
const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        "http://localhost:5173",
        "https://aiwear-lac.vercel.app",
        "https://aiwear-git-main-rishabh-dubeys-projects-4ed3d44a.vercel.app",
        "https://aiwear-crdg92d7j-rishabh-dubeys-projects-4ed3d44a.vercel.app",
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ─── Routes ─────────────────────────────────────────── */
/* ─── Routes ─────────────────────────────────────────── */
app.use("/api/auth", authRoutes);
app.use("/api/tryon", tryonRoutes);
app.use("/api/upload", uploadRoute); // ✅ ADD THIS
/* ─── Health check ───────────────────────────────────── */
app.get("/", (req, res) => {
  res.json({ success: true, message: "AI Wear Server 🚀" });
});

/* ─── 404 ────────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ─── Error handler ──────────────────────────────────── */
app.use((err, req, res, _next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

/* ─── Start ──────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));

process.on("unhandledRejection", (err) => console.error("Unhandled:", err));
process.on("uncaughtException", (err) => console.error("Uncaught:", err));

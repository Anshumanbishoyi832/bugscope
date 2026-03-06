import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import errorRoutes from "./routes/errorRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// ── Environment validation ────────────────────────────────────────────────────
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

connectDB();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, mobile apps, SDK)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS: origin not allowed"));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" })); // Guard against huge JSON payloads

// ── Rate Limiting ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again after 15 minutes." }
});

const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 200,                  // max 200 SDK error reports per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many error reports, slow down." }
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/errors", errorRoutes);

// SDK static files
app.use("/sdk", express.static(path.join(__dirname, "../sdk")));

// Apply separate rate limit to the public SDK ingest endpoint only
app.use("/api/errors", (req, res, next) => {
  if (req.method === "POST") return ingestLimiter(req, res, next);
  next();
});

app.get("/", (req, res) => {
  res.send("BugScope API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
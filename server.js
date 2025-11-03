import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// ---------- CONFIG ----------
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_URI;

// Resolve __dirname (ESM fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- DATABASE ----------
const connectDB = async () => {
  if (!MONGODB_URI) {
    console.error("❌ MONGO_URI is missing in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error(`❌ MongoDB Connection Failed: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---------- ROUTES ----------
import weatherRouter from "./routes/weather.js";
import checklistRouter from "./routes/checklist.js";
import authRouter from "./routes/auth.js";
import tripsRouter from "./routes/trips.js";
import itinerariesRouter from "./routes/itineraries.js";
import landmarksRouter from "./routes/landmarks.js";
import phrasesRouter from "./routes/phrases.js";
import plannerRouter from "./routes/planner.js";

app.use("/api/weather", weatherRouter);
app.use("/api/checklist", checklistRouter);
app.use("/api/auth", authRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/itineraries", itinerariesRouter);
app.use("/api/landmarks", landmarksRouter);
app.use("/api/phrases", phrasesRouter);
app.use("/api/planner", plannerRouter);

// ---------- SERVE REACT FRONTEND (for Render) ----------
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");

  // Serve static files from React app
  app.use(express.static(clientBuildPath));

  // Handle React routing, return index.html for unknown routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("🌍 API is running... (Development Mode)");
  });
}

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});

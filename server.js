require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const weatherRoutes = require("./routes/weather");
const landmarkRoutes = require("./routes/landmarks");
const phraseRoutes = require("./routes/phrases");
const plannerRoutes = require("./routes/planner");
const checklistRoutes = require("./routes/checklist");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (Define them before starting the server)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/trips", require("./routes/trips"));
app.use("/api/itineraries", require("./routes/itineraries"));
app.use("/api/weather", require("./routes/weather"));
app.use("/api/weather", weatherRoutes);
app.use("/api/landmarks", landmarkRoutes);
app.use("/api/phrases", phraseRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/checklist", checklistRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/smart-travel-companion"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

// Function to start the server
const startServer = async () => {
  // 1. Connect to database FIRST
  await connectDB();

  // 2. Serve static files in production (after DB connection)
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/build")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
  }

  // 3. Start listening for requests ONLY after DB is connected
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Start the server
startServer();

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();


// Connect MongoDB
connectDB();


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://student-resources-hub.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/upload", uploadRoutes);


// Upload folder access
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Student Resources Hub Backend Running"
  });
});


// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});


// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
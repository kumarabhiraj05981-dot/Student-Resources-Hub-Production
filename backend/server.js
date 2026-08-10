require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();


// ======================================================
// CONNECT MONGODB
// ======================================================

connectDB();


// ======================================================
// CORS
// ======================================================

const allowedOrigins = [
  "http://localhost:5173",

  "https://student-resources-hub-live-y438.vercel.app",

  "https://student-resources-hub-live-y438-puhj1vkih-student-resource-hub1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log(
        "❌ CORS BLOCKED ORIGIN:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);


// ======================================================
// BODY PARSER
// ======================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {

  return res.status(200).send(
    "🚀 Student Resources Hub Backend Running"
  );

});


// ======================================================
// API TEST
// ======================================================

app.get("/api/test", (req, res) => {

  return res.status(200).json({
    success: true,
    message: "Student Resources Hub API is working",
  });

});


// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// RESOURCE ROUTES
// ======================================================
//
// Examples:
//
// GET    /api/resources
// GET    /api/resources/category/Notes
// GET    /api/resources/semester/1st%20Semester
// GET    /api/resources/branch/Electrical
// DELETE /api/resources/:id
//
// ======================================================

app.use(
  "/api/resources",
  resourceRoutes
);


// ======================================================
// UPLOAD ROUTES
// ======================================================
//
// IMPORTANT:
//
// Admin frontend sends:
//
// POST /api/upload
//
// Therefore this router must remain:
//
// /api/upload
//
// ======================================================

app.use(
  "/api/upload",
  uploadRoutes
);


// ======================================================
// AI QUESTION PAPER ROUTES
// ======================================================

app.use(
  "/api/ai",
  aiRoutes
);


// ======================================================
// STATIC UPLOADS
// ======================================================
//
// For local uploaded files:
//
// /uploads/filename.pdf
//
// Cloudinary resources will normally use their
// Cloudinary URL directly.
//

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ======================================================
// RESOURCE DELETE TEST
// ======================================================
//
// This is only a development test route.
// It is intentionally kept before the 404 handler.
//

app.delete(
  "/api/resources/test-delete",
  (req, res) => {

    console.log(
      "DELETE TEST ROUTE HIT"
    );

    return res.status(200).json({
      success: true,
      message: "DELETE route is working",
    });

  }
);


// ======================================================
// 404 HANDLER
// ======================================================

app.use(
  (req, res) => {

    console.log(
      "❌ 404 ROUTE NOT FOUND:",
      req.method,
      req.originalUrl
    );

    return res.status(404).json({

      success: false,

      message: "Route Not Found",

      method: req.method,

      path: req.originalUrl,

    });

  }
);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (err, req, res, next) => {

    console.error(
      "======================================"
    );

    console.error(
      "❌ SERVER ERROR:"
    );

    console.error(err);

    console.error(
      "======================================"
    );


    return res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal Server Error",

    });

  }
);


// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(
      "======================================"
    );

    console.log(
      `🚀 Student Resources Hub Server`
    );

    console.log(
      `🚀 Running on port ${PORT}`
    );

    console.log(
      `🚀 API: http://localhost:${PORT}/api`
    );

    console.log(
      "======================================"
    );

  }
);

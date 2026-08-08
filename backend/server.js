require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();


// ======================================
// CONNECT MONGODB
// ======================================

connectDB();


// ======================================
// CORS
// ======================================

const allowedOrigins = [
  "http://localhost:5173",

  "https://student-resources-hub-live-y438.vercel.app",

  "https://student-resources-hub-live-y438-puhj1vkih-student-resource-hub1.vercel.app",
];


app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow exact origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("CORS BLOCKED ORIGIN:", origin);

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


// ======================================
// BODY PARSER
// ======================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================================
// API ROUTES
// ======================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/resources",
  resourceRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);


// ======================================
// STATIC UPLOADS
// ======================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ======================================
// HOME TEST
// ======================================

app.get("/", (req, res) => {

  res.status(200).send(
    "🚀 Student Resources Hub Backend Running"
  );

});


// ======================================
// API TEST
// ======================================

app.get("/api/test", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Student Resources Hub API is working",
  });

});


// ======================================
// RESOURCE DELETE TEST
// ======================================

app.delete(
  "/api/resources/test-delete",
  (req, res) => {

    console.log(
      "DELETE TEST ROUTE HIT"
    );

    res.status(200).json({
      success: true,
      message: "DELETE route is working",
    });

  }
);


// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {

  console.log(
    "404 ROUTE NOT FOUND:",
    req.method,
    req.originalUrl
  );

  res.status(404).json({

    success: false,

    message: "Route Not Found",

    method: req.method,

    path: req.originalUrl,

  });

});


// ======================================
// ERROR HANDLER
// ======================================

app.use(
  (err, req, res, next) => {

    console.error(
      "================================="
    );

    console.error(
      "SERVER ERROR:",
      err
    );

    console.error(
      "================================="
    );

    res.status(
      err.status || 500
    ).json({

      success: false,

      message:
        err.message ||
        "Internal Server Error",

    });

  }
);


// ======================================
// START SERVER
// ======================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `🚀 Server running on port ${PORT}`
    );

  }
);
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

  // Vercel main domain
  "https://student-resources-hub-live-y438.vercel.app",

  // Current Vercel deployment URL
  "https://student-resources-hub-live-y438-puhj1vkih-student-resource-hub1.vercel.app",
];


app.use(
  cors({

    origin: function (origin, callback) {

      // Allow requests without origin
      // (Postman, server-to-server etc.)
      if (!origin) {
        return callback(null, true);
      }


      // Exact allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }


      // Allow Vercel preview/deployment URLs
      if (
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }


      console.log(
        "CORS BLOCKED ORIGIN:",
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
// UPLOADS
// ======================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ======================================
// TEST ROUTE
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

  res.json({

    success: true,

    message:
      "Student Resources Hub API is working",

  });

});


// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route Not Found",

    path: req.originalUrl,

  });

});


// ======================================
// ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {

  console.error(
    "SERVER ERROR:",
    err
  );


  res.status(
    err.status || 500
  ).json({

    success: false,

    message:
      err.message ||
      "Internal Server Error",

  });

});


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
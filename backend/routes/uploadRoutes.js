const express = require("express");
const router = express.Router();

const multer = require("multer");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const adminAuth = require("../middleware/adminAuth");


// ======================================
// MULTER - MEMORY STORAGE
// ======================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }

  },
});


// ======================================
// TEST ROUTE
// ======================================

router.get("/test", (req, res) => {

  res.json({
    success: true,
    message: "Upload route is working",
  });

});


// ======================================
// UPLOAD PDF
// ADMIN ONLY
// ======================================

router.post(
  "/",
  adminAuth,
  upload.single("file"),

  async (req, res) => {

    try {

      console.log("=================================");
      console.log("UPLOAD BODY:", req.body);
      console.log("UPLOAD FILE:", req.file?.originalname);
      console.log("UPLOAD MIME:", req.file?.mimetype);
      console.log("=================================");


      // Check file
      if (!req.file) {

        return res.status(400).json({
          success: false,
          message: "Please select a PDF file",
        });

      }


      const {
        title,
        description,
        semester,
        category,
        subject,
      } = req.body;


      // Validate
      if (!title || !semester || !category) {

        return res.status(400).json({
          success: false,
          message:
            "Title, semester and category are required",
        });

      }


      // ======================================
      // CLOUDINARY RAW PDF UPLOAD
      // ======================================

      const uploadToCloudinary = () => {

        return new Promise((resolve, reject) => {

          const stream = cloudinary.uploader.upload_stream(

            {
              folder: "student-resources",

              resource_type: "raw",

              use_filename: true,

              unique_filename: true,

              overwrite: false,

            },

            (error, result) => {

              if (error) {
                reject(error);
              } else {
                resolve(result);
              }

            }

          );


          stream.end(req.file.buffer);

        });

      };


      const cloudinaryResult =
        await uploadToCloudinary();


      console.log(
        "CLOUDINARY RESULT:",
        cloudinaryResult
      );


      // ======================================
      // SAVE TO MONGODB
      // ======================================

      const resource = new Resource({

        title: title.trim(),

        description: description || "",

        semester: semester,

        category: category,

        subject: subject || "",

        fileUrl: cloudinaryResult.secure_url,

        filePublicId: cloudinaryResult.public_id,

        fileName: req.file.originalname,

        uploadedBy: req.user._id,

      });


      await resource.save();


      console.log(
        "RESOURCE SAVED:",
        resource
      );


      // ======================================
      // RESPONSE
      // ======================================

      return res.status(201).json({

        success: true,

        message:
          "PDF uploaded successfully!",

        resource,

      });


    } catch (error) {

      console.error(
        "RESOURCE UPLOAD ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "PDF upload failed",

      });

    }

  }
);


module.exports = router;
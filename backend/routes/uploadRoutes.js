const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const adminAuth = require("../middleware/adminAuth");


// ======================================
// MULTER - MEMORY STORAGE
// ======================================

const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
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
      console.log(
        "UPLOAD FILE:",
        req.file?.originalname
      );
      console.log(
        "UPLOAD MIME:",
        req.file?.mimetype
      );
      console.log("=================================");


      // ======================================
      // CHECK FILE
      // ======================================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message: "Please select a PDF file",

        });

      }


      // ======================================
      // GET FORM DATA
      // ======================================

      const {
        title,
        description,
        semester,
        category,
        subject,
      } = req.body;


      // ======================================
      // VALIDATION
      // ======================================

      if (!title || !semester || !category) {

        return res.status(400).json({

          success: false,

          message:
            "Title, semester and category are required",

        });

      }


      // ======================================
      // CREATE CLEAN FILE NAME
      // ======================================

      const originalFileName =
        req.file.originalname;


      // Get extension
      const extension =
        path.extname(originalFileName)
          .toLowerCase();


      // Remove extension
      const nameWithoutExtension =
        path.basename(
          originalFileName,
          extension
        );


      // Clean filename
      const cleanFileName =
        nameWithoutExtension

          .replace(
            /[^a-zA-Z0-9-_ ]/g,
            ""
          )

          .trim()

          .replace(
            /\s+/g,
            "-"
          );


      // Add timestamp so duplicate names
      // don't overwrite each other
      const publicId =
        `${cleanFileName}-${Date.now()}${extension}`;


      console.log(
        "CLEAN FILE NAME:",
        cleanFileName
      );

      console.log(
        "CLOUDINARY PUBLIC ID:",
        publicId
      );


      // ======================================
      // CLOUDINARY RAW PDF UPLOAD
      // ======================================

      const uploadToCloudinary = () => {

        return new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(

              {

                folder:
                  "student-resources",

                // IMPORTANT
                resource_type:
                  "raw",

                // Use our own filename
                public_id:
                  publicId,

                // Never overwrite existing file
                overwrite:
                  false,

              },

              (error, result) => {

                if (error) {

                  reject(error);

                } else {

                  resolve(result);

                }

              }

            );


          // Send PDF buffer
          stream.end(
            req.file.buffer
          );

        });

      };


      // Upload to Cloudinary
      const cloudinaryResult =
        await uploadToCloudinary();


      console.log(
        "================================="
      );

      console.log(
        "CLOUDINARY RESULT:",
        cloudinaryResult
      );

      console.log(
        "CLOUDINARY URL:",
        cloudinaryResult.secure_url
      );

      console.log(
        "================================="
      );


      // ======================================
      // SAVE RESOURCE TO MONGODB
      // ======================================

      const resource =
        new Resource({

          title:
            title.trim(),

          description:
            description || "",

          semester:
            semester,

          category:
            category,

          subject:
            subject || "",

          fileUrl:
            cloudinaryResult.secure_url,

          filePublicId:
            cloudinaryResult.public_id,

          fileName:
            originalFileName,

          uploadedBy:
            req.user._id,

        });


      await resource.save();


      console.log(
        "RESOURCE SAVED:",
        resource
      );


      // ======================================
      // SUCCESS RESPONSE
      // ======================================

      return res.status(201).json({

        success: true,

        message:
          "PDF uploaded successfully!",

        resource,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "RESOURCE UPLOAD ERROR:",
        error
      );

      console.error(
        "================================="
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


// ======================================
// EXPORT
// ======================================

module.exports = router;
const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const adminAuth = require("../middleware/adminAuth");


// ======================================================
// ALLOWED BRANCHES
// ======================================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];


// ======================================================
// ALLOWED CATEGORIES
// ======================================================

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];


// ======================================================
// MULTER - MEMORY STORAGE
// ======================================================

const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    // 500 MB
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (
      file.mimetype === "application/pdf" ||
      file.originalname
        .toLowerCase()
        .endsWith(".pdf")
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only PDF files are allowed"
        )
      );

    }

  },

});


// ======================================================
// TEST ROUTE
// ======================================================

router.get(
  "/test",
  (req, res) => {

    return res.json({

      success: true,

      message:
        "Upload route is working",

    });

  }
);


// ======================================================
// UPLOAD PDF
// ADMIN ONLY
//
// POST /api/upload
// ======================================================

router.post(
  "/",
  adminAuth,
  upload.single("file"),

  async (req, res) => {

    try {

      console.log(
        "======================================"
      );

      console.log(
        "📚 RESOURCE UPLOAD REQUEST"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file?.originalname
      );

      console.log(
        "MIME:",
        req.file?.mimetype
      );

      console.log(
        "USER:",
        req.user
      );

      console.log(
        "======================================"
      );


      // ==================================================
      // CHECK FILE
      // ==================================================

      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a PDF file",

        });

      }


      // ==================================================
      // GET FORM DATA
      // ==================================================

      const {
        title,
        description,
        branch,
        semester,
        category,
        subject,
      } = req.body;


      // ==================================================
      // TITLE VALIDATION
      // ==================================================

      if (
        !title ||
        !title.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Resource title is required",

        });

      }


      // ==================================================
      // BRANCH VALIDATION
      // ==================================================

      if (
        !branch ||
        !branch.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please select a branch",

        });

      }


      const selectedBranch =
        branch.trim();


      // ==================================================
      // CHECK VALID BRANCH
      // ==================================================

      if (
        !ALLOWED_BRANCHES.includes(
          selectedBranch
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid branch: ${selectedBranch}`,

        });

      }


      // ==================================================
      // SEMESTER VALIDATION
      // ==================================================

      if (
        !semester ||
        !semester.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please select semester",

        });

      }


      // ==================================================
      // CATEGORY VALIDATION
      // ==================================================

      if (
        !category ||
        !category.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please select category",

        });

      }


      const selectedCategory =
        category.trim();


      // ==================================================
      // CHECK VALID CATEGORY
      // ==================================================

      if (
        !ALLOWED_CATEGORIES.includes(
          selectedCategory
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Invalid category: ${selectedCategory}`,

        });

      }


      // ==================================================
      // CREATE CLEAN FILE NAME
      // ==================================================

      const originalFileName =
        req.file.originalname;


      const extension =
        path
          .extname(originalFileName)
          .toLowerCase();


      const nameWithoutExtension =
        path.basename(
          originalFileName,
          extension
        );


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


      const finalCleanFileName =
        cleanFileName ||
        "resource";


      // ==================================================
      // CLOUDINARY PUBLIC ID
      // ==================================================

      const publicId =
        `${finalCleanFileName}-${Date.now()}`;


      console.log(
        "CLEAN FILE NAME:",
        finalCleanFileName
      );

      console.log(
        "CLOUDINARY PUBLIC ID:",
        publicId
      );


      // ==================================================
      // UPLOAD PDF TO CLOUDINARY
      // ==================================================

      const uploadToCloudinary =
        () => {

          return new Promise(
            (resolve, reject) => {

              const stream =
                cloudinary
                  .uploader
                  .upload_stream(

                    {

                      folder:
                        "student-resources",

                      resource_type:
                        "raw",

                      public_id:
                        publicId,

                      overwrite:
                        false,

                    },

                    (
                      error,
                      result
                    ) => {

                      if (error) {

                        reject(
                          error
                        );

                      } else {

                        resolve(
                          result
                        );

                      }

                    }

                  );


              stream.end(
                req.file.buffer
              );

            }
          );

        };


      // ==================================================
      // CLOUDINARY UPLOAD
      // ==================================================

      const cloudinaryResult =
        await uploadToCloudinary();


      console.log(
        "======================================"
      );

      console.log(
        "☁️ CLOUDINARY UPLOAD SUCCESS"
      );

      console.log(
        "URL:",
        cloudinaryResult.secure_url
      );

      console.log(
        "PUBLIC ID:",
        cloudinaryResult.public_id
      );

      console.log(
        "======================================"
      );


      // ==================================================
      // GET ADMIN USER ID
      // ==================================================

      const uploadedBy =
        req.user?._id ||
        req.user?.id;


      // ==================================================
      // CREATE RESOURCE
      // ==================================================

      const resource =
        new Resource({

          // --------------------------------------------
          // BASIC INFORMATION
          // --------------------------------------------

          title:
            title.trim(),

          description:
            description
              ? description.trim()
              : "",


          // --------------------------------------------
          // ⭐ VERY IMPORTANT
          // SAVE SELECTED BRANCH
          // --------------------------------------------

          branch:
            selectedBranch,


          // --------------------------------------------
          // SEMESTER
          // --------------------------------------------

          semester:
            semester.trim(),


          // --------------------------------------------
          // CATEGORY
          // --------------------------------------------

          category:
            selectedCategory,


          // --------------------------------------------
          // SUBJECT
          // --------------------------------------------

          subject:
            subject
              ? subject.trim()
              : "",


          // --------------------------------------------
          // CLOUDINARY FILE
          // --------------------------------------------

          fileUrl:
            cloudinaryResult.secure_url,

          filePublicId:
            cloudinaryResult.public_id,

          fileName:
            originalFileName,


          // --------------------------------------------
          // UPLOADED BY
          // --------------------------------------------

          uploadedBy:
            uploadedBy,

        });


      // ==================================================
      // SAVE TO MONGODB
      // ==================================================

      await resource.save();


      // ==================================================
      // LOG SAVED DATA
      // ==================================================

      console.log(
        "======================================"
      );

      console.log(
        "✅ RESOURCE SAVED TO MONGODB"
      );

      console.log(
        "ID:",
        resource._id
      );

      console.log(
        "TITLE:",
        resource.title
      );

      console.log(
        "BRANCH:",
        resource.branch
      );

      console.log(
        "SEMESTER:",
        resource.semester
      );

      console.log(
        "CATEGORY:",
        resource.category
      );

      console.log(
        "SUBJECT:",
        resource.subject
      );

      console.log(
        "======================================"
      );


      // ==================================================
      // SUCCESS RESPONSE
      // ==================================================

      return res.status(201).json({

        success: true,

        message:
          "PDF uploaded successfully!",

        resource,

      });


    } catch (error) {

      console.error(
        "======================================"
      );

      console.error(
        "❌ RESOURCE UPLOAD ERROR"
      );

      console.error(
        error
      );

      console.error(
        "======================================"
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


// ======================================================
// EXPORT
// ======================================================

module.exports = router;

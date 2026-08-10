const express = require("express");
const multer = require("multer");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// ======================================
// ALLOWED BRANCHES
// ======================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

// ======================================
// ALLOWED CATEGORIES
// ======================================

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

// ======================================
// MULTER - MEMORY STORAGE
// ======================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 500 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const isPDF =
      file.mimetype ===
        "application/pdf" ||
      file.originalname
        .toLowerCase()
        .endsWith(".pdf");

    if (isPDF) {
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

// ======================================
// TEST ROUTE
// GET /api/upload/test
// ======================================

router.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Upload route is working",
  });
});

// ======================================
// UPLOAD PDF
// POST /api/upload
// ADMIN ONLY
// ======================================

router.post(
  "/",
  adminAuth,
  upload.single("file"),

  async (req, res) => {
    let cloudinaryPublicId = null;

    try {
      console.log(
        "================================="
      );
      console.log("UPLOAD REQUEST");
      console.log(
        "================================="
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

      // ======================================
      // CHECK FILE
      // ======================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a PDF file",
        });
      }

      // ======================================
      // GET FORM DATA
      // ======================================

      const {
        title,
        description,
        branch,
        semester,
        category,
        subject,
      } = req.body;

      // ======================================
      // TITLE
      // ======================================

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

      // ======================================
      // BRANCH
      // ======================================

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

      const cleanBranch =
        branch.trim();

      if (
        !ALLOWED_BRANCHES.includes(
          cleanBranch
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid branch",
          allowedBranches:
            ALLOWED_BRANCHES,
        });
      }

      // ======================================
      // SEMESTER
      // ======================================

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

      const cleanSemester =
        semester.trim();

      // ======================================
      // CATEGORY
      // ======================================

      if (!category) {
        return res.status(400).json({
          success: false,
          message:
            "Please select category",
        });
      }

      if (
        !ALLOWED_CATEGORIES.includes(
          category
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid resource category",
          allowedCategories:
            ALLOWED_CATEGORIES,
        });
      }

      // ======================================
      // SUBJECT
      // ======================================

      const cleanSubject =
        subject
          ? subject.trim()
          : "";

      // ======================================
      // ORIGINAL FILE NAME
      // ======================================

      const originalFileName =
        req.file.originalname;

      const extension =
        path.extname(
          originalFileName
        ).toLowerCase();

      const nameWithoutExtension =
        path.basename(
          originalFileName,
          extension
        );

      // ======================================
      // SAFE FILE NAME
      // ======================================

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

      const safeFileName =
        cleanFileName ||
        "resource";

      // ======================================
      // CLOUDINARY PUBLIC ID
      // PDF EXTENSION INCLUDED
      // ======================================

      const publicId =
        `student-resources/${safeFileName}-${Date.now()}.pdf`;

      console.log(
        "ORIGINAL FILE:",
        originalFileName
      );

      console.log(
        "SAFE FILE:",
        safeFileName
      );

      console.log(
        "BRANCH:",
        cleanBranch
      );

      console.log(
        "SEMESTER:",
        cleanSemester
      );

      console.log(
        "CATEGORY:",
        category
      );

      console.log(
        "SUBJECT:",
        cleanSubject
      );

      console.log(
        "PUBLIC ID:",
        publicId
      );

      // ======================================
      // CLOUDINARY UPLOAD
      // ======================================

      const uploadToCloudinary =
        () => {
          return new Promise(
            (
              resolve,
              reject
            ) => {
              const stream =
                cloudinary.uploader.upload_stream(
                  {
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

      const cloudinaryResult =
        await uploadToCloudinary();

      // ======================================
      // CLOUDINARY RESULT
      // ======================================

      if (
        !cloudinaryResult ||
        !cloudinaryResult.secure_url
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Cloudinary upload failed",
        });
      }

      cloudinaryPublicId =
        cloudinaryResult.public_id;

      console.log(
        "CLOUDINARY URL:",
        cloudinaryResult.secure_url
      );

      console.log(
        "CLOUDINARY PUBLIC ID:",
        cloudinaryResult.public_id
      );

      // ======================================
      // CREATE RESOURCE
      // ======================================

      const resource =
        new Resource({
          title:
            title.trim(),

          description:
            description
              ? description.trim()
              : "",

          branch:
            cleanBranch,

          semester:
            cleanSemester,

          category,

          subject:
            cleanSubject,

          fileUrl:
            cloudinaryResult.secure_url,

          filePublicId:
            cloudinaryResult.public_id,

          fileName:
            originalFileName,

          uploadedBy:
            req.user?._id,
        });

      // ======================================
      // SAVE MONGODB
      // ======================================

      await resource.save();

      // ======================================
      // SUCCESS LOG
      // ======================================

      console.log(
        "================================="
      );

      console.log(
        "RESOURCE SAVED SUCCESSFULLY"
      );

      console.log(
        "================================="
      );

      console.log(
        "RESOURCE ID:",
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
        "FILE:",
        resource.fileName
      );

      console.log(
        "================================="
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
        "================================="
      );

      console.error(
        "RESOURCE UPLOAD ERROR:",
        error
      );

      console.error(
        "================================="
      );

      // ======================================
      // CLEAN CLOUDINARY FILE
      // IF MONGODB SAVE FAILED
      // ======================================

      if (cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(
            cloudinaryPublicId,
            {
              resource_type:
                "raw",
            }
          );

          console.log(
            "Orphan Cloudinary file deleted"
          );
        } catch (cleanupError) {
          console.error(
            "Cloudinary cleanup error:",
            cleanupError
          );
        }
      }

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
// MULTER ERROR HANDLER
// ======================================

router.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "File size cannot exceed 500MB",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "File upload error",
      });
    }

    next();
  }
);

// ======================================
// EXPORT
// ======================================

module.exports = router;

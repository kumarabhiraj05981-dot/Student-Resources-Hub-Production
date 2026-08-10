const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const adminAuth = require("../middleware/adminAuth");

// ======================================
// BRANCHES
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
// MULTER - MEMORY STORAGE
// ======================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
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
  return res.status(200).json({
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
      console.log("UPLOAD REQUEST");
      console.log("=================================");

      console.log("BODY:", req.body);

      console.log("BRANCH RECEIVED:", req.body?.branch);

      console.log(
        "FILE:",
        req.file?.originalname
      );

      console.log(
        "MIME:",
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
        branch,
        semester,
        category,
        subject,
      } = req.body;

      // ======================================
      // VALIDATE TITLE
      // ======================================

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Resource title is required",
        });
      }

      // ======================================
      // VALIDATE BRANCH
      // ======================================

      if (!branch || !branch.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select a branch",
        });
      }

      const cleanBranch = branch.trim();

      if (!ALLOWED_BRANCHES.includes(cleanBranch)) {
        return res.status(400).json({
          success: false,
          message: `Invalid branch. Allowed branches: ${ALLOWED_BRANCHES.join(
            ", "
          )}`,
        });
      }

      // ======================================
      // VALIDATE SEMESTER
      // ======================================

      if (!semester || !semester.trim()) {
        return res.status(400).json({
          success: false,
          message: "Please select semester",
        });
      }

      // ======================================
      // VALIDATE CATEGORY
      // ======================================

      const ALLOWED_CATEGORIES = [
        "Notes",
        "PYQ",
        "Syllabus",
        "Ebooks",
        "Other",
      ];

      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Please select category",
        });
      }

      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource category",
        });
      }

      // ======================================
      // CREATE CLEAN FILE NAME
      // ======================================

      const originalFileName =
        req.file.originalname;

      const extension =
        path.extname(originalFileName).toLowerCase();

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
          .replace(/\s+/g, "-");

      const safeFileName =
        cleanFileName || "resource";

      // ======================================
      // CLOUDINARY PUBLIC ID
      // ======================================

      const publicId =
        `${safeFileName}-${Date.now()}`;

      console.log(
        "ORIGINAL FILE:",
        originalFileName
      );

      console.log(
        "CLEAN FILE:",
        safeFileName
      );

      console.log(
        "BRANCH:",
        cleanBranch
      );

      console.log(
        "PUBLIC ID:",
        publicId
      );

      // ======================================
      // CLOUDINARY UPLOAD
      // ======================================

      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "student-resources",

                resource_type: "raw",

                public_id: publicId,

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

      // ======================================
      // CHECK CLOUDINARY RESULT
      // ======================================

      if (
        !cloudinaryResult ||
        !cloudinaryResult.secure_url
      ) {
        return res.status(500).json({
          success: false,
          message:
            "File uploaded but Cloudinary URL was not received",
        });
      }

      console.log(
        "CLOUDINARY URL:",
        cloudinaryResult.secure_url
      );

      console.log(
        "CLOUDINARY PUBLIC ID:",
        cloudinaryResult.public_id
      );

      // ======================================
      // SAVE RESOURCE TO MONGODB
      // ======================================

      const resource = new Resource({
        title: title.trim(),

        description:
          description
            ? description.trim()
            : "",

        // ⭐ VERY IMPORTANT
        // Selected branch is saved here
        branch: cleanBranch,

        semester:
          semester.trim(),

        category,

        subject:
          subject
            ? subject.trim()
            : "",

        fileUrl:
          cloudinaryResult.secure_url,

        filePublicId:
          cloudinaryResult.public_id,

        fileName:
          originalFileName,

        uploadedBy:
          req.user?._id,
      });

      await resource.save();

      // ======================================
      // LOG SAVED DATA
      // ======================================

      console.log("=================================");
      console.log("RESOURCE SAVED SUCCESSFULLY");
      console.log("=================================");

      console.log("RESOURCE ID:", resource._id);
      console.log("TITLE:", resource.title);
      console.log("BRANCH:", resource.branch);
      console.log("SEMESTER:", resource.semester);
      console.log("CATEGORY:", resource.category);
      console.log("SUBJECT:", resource.subject);

      console.log("=================================");

      // ======================================
      // SUCCESS
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

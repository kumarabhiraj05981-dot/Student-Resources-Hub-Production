const express = require("express");
const mongoose = require("mongoose");

const Resource = require("../models/Resource");
const adminAuth = require("../middleware/adminAuth");
const cloudinary = require("../config/cloudinary");

const router = express.Router();


// ============================================================
// BRANCH LIST
// ============================================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];


// ============================================================
// CATEGORY LIST
// ============================================================

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];


// ============================================================
// GET ALL RESOURCES
// ============================================================

router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {
    console.error("GET RESOURCES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load resources",
    });
  }
});


// ============================================================
// GET RESOURCES BY BRANCH
// ============================================================

router.get("/branch/:branch", async (req, res) => {
  try {
    const branch = decodeURIComponent(
      req.params.branch
    ).trim();

    if (!ALLOWED_BRANCHES.includes(branch)) {
      return res.status(400).json({
        success: false,
        message: "Invalid branch",
      });
    }

    const resources = await Resource.find({
      branch: branch,
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      branch,
      count: resources.length,
      resources,
    });

  } catch (error) {
    console.error(
      "GET BRANCH RESOURCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load branch resources",
    });
  }
});


// ============================================================
// GET RESOURCES BY BRANCH + CATEGORY
// ============================================================

router.get(
  "/branch/:branch/category/:category",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      ).trim();

      const category = decodeURIComponent(
        req.params.category
      ).trim();

      if (!ALLOWED_BRANCHES.includes(branch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
        });
      }

      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }

      const resources = await Resource.find({
        branch: branch,
        category: {
          $regex: `^${category}$`,
          $options: "i",
        },
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        branch,
        category,
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "GET BRANCH CATEGORY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load branch category resources",
      });
    }
  }
);


// ============================================================
// GET RESOURCES BY CATEGORY
// ============================================================

router.get(
  "/category/:category",
  async (req, res) => {
    try {
      const category = decodeURIComponent(
        req.params.category
      ).trim();

      const resources = await Resource.find({
        category: {
          $regex: `^${category}$`,
          $options: "i",
        },
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        category,
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "CATEGORY RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load category resources",
      });
    }
  }
);


// ============================================================
// GET RESOURCES BY SEMESTER
// ============================================================

router.get(
  "/semester/:semester",
  async (req, res) => {
    try {
      const semester = decodeURIComponent(
        req.params.semester
      ).trim();

      const resources = await Resource.find({
        semester: {
          $regex: `^${semester}$`,
          $options: "i",
        },
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        semester,
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "SEMESTER RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load semester resources",
      });
    }
  }
);


// ============================================================
// GET RESOURCES BY BRANCH + SEMESTER
// ============================================================

router.get(
  "/branch/:branch/semester/:semester",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      ).trim();

      const semester = decodeURIComponent(
        req.params.semester
      ).trim();

      if (!ALLOWED_BRANCHES.includes(branch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
        });
      }

      const resources = await Resource.find({
        branch: branch,
        semester: {
          $regex: `^${semester}$`,
          $options: "i",
        },
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        branch,
        semester,
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "BRANCH SEMESTER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load branch semester resources",
      });
    }
  }
);


// ============================================================
// SEARCH RESOURCES
// ============================================================

router.get(
  "/search/:keyword",
  async (req, res) => {
    try {
      const keyword = decodeURIComponent(
        req.params.keyword
      ).trim();

      const resources = await Resource.find({
        $or: [
          {
            title: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            subject: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            description: {
              $regex: keyword,
              $options: "i",
            },
          },
          {
            branch: {
              $regex: keyword,
              $options: "i",
            },
          },
        ],
      })
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        keyword,
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "SEARCH RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Search failed",
      });
    }
  }
);


// ============================================================
// UPLOAD RESOURCE
// ADMIN ONLY
//
// IMPORTANT:
// Admin.tsx sends:
//
// POST /api/upload
//
// server.js should mount this router like:
//
// app.use("/api", resourceRoutes);
//
// ============================================================

router.post(
  "/upload",
  adminAuth,
  async (req, res) => {

    try {

      console.log(
        "======================================"
      );

      console.log(
        "RESOURCE UPLOAD REQUEST RECEIVED"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "======================================"
      );


      // ======================================================
      // GET DATA
      // ======================================================

      const {
        title,
        description,
        branch,
        semester,
        category,
        subject,
      } = req.body;


      // ======================================================
      // VALIDATE TITLE
      // ======================================================

      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Resource title is required",
        });
      }


      // ======================================================
      // VALIDATE BRANCH
      // ======================================================

      if (!branch || !branch.trim()) {
        return res.status(400).json({
          success: false,
          message: "Branch is required",
        });
      }


      // ======================================================
      // IMPORTANT
      // DO NOT FORCE COMPUTER SCIENCE
      // ======================================================

      const selectedBranch = branch.trim();


      if (
        !ALLOWED_BRANCHES.includes(
          selectedBranch
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid branch selected",
        });
      }


      // ======================================================
      // VALIDATE SEMESTER
      // ======================================================

      if (!semester || !semester.trim()) {
        return res.status(400).json({
          success: false,
          message: "Semester is required",
        });
      }


      // ======================================================
      // VALIDATE CATEGORY
      // ======================================================

      if (!category || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: "Category is required",
        });
      }


      if (
        !ALLOWED_CATEGORIES.includes(
          category.trim()
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid category selected",
        });
      }


      // ======================================================
      // FILE
      // ======================================================

      /*
        IMPORTANT:

        Depending on your upload middleware,
        req.file may already contain Cloudinary data.

        Example:

        req.file.path
        req.file.secure_url
        req.file.public_id
      */

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "PDF file is required",
        });
      }


      // ======================================================
      // GET CLOUDINARY URL
      // ======================================================

      const fileUrl =
        req.file.secure_url ||
        req.file.path ||
        req.file.url ||
        "";


      const filePublicId =
        req.file.public_id ||
        req.file.filename ||
        "";


      const fileName =
        req.file.originalname ||
        req.file.original_filename ||
        req.file.filename ||
        "";


      if (!fileUrl) {
        return res.status(500).json({
          success: false,
          message:
            "File uploaded but Cloudinary URL was not found",
        });
      }


      // ======================================================
      // USER
      // ======================================================

      const uploadedBy =
        req.user?._id ||
        req.user?.id ||
        null;


      // ======================================================
      // CREATE RESOURCE
      // ======================================================

      const resourceData = {
        title: title.trim(),

        description:
          description
            ? description.trim()
            : "",

        // ================================================
        // VERY IMPORTANT
        // SELECTED BRANCH IS SAVED HERE
        // ================================================

        branch: selectedBranch,

        semester: semester.trim(),

        category: category.trim(),

        subject:
          subject
            ? subject.trim()
            : "",

        fileUrl: fileUrl,

        filePublicId:
          filePublicId,

        fileName:
          fileName,

        uploadedBy:
          uploadedBy,
      };


      console.log(
        "RESOURCE DATA TO SAVE:",
        resourceData
      );


      // ======================================================
      // SAVE TO MONGODB
      // ======================================================

      const resource =
        await Resource.create(
          resourceData
        );


      // ======================================================
      // SUCCESS
      // ======================================================

      console.log(
        "RESOURCE SAVED SUCCESSFULLY:"
      );

      console.log({
        id: resource._id,
        title: resource.title,
        branch: resource.branch,
        semester: resource.semester,
        category: resource.category,
      });


      return res.status(201).json({
        success: true,

        message:
          "Resource uploaded successfully",

        resource,
      });

    } catch (error) {

      console.error(
        "======================================"
      );

      console.error(
        "RESOURCE UPLOAD ERROR:",
        error
      );

      console.error(
        "======================================"
      );


      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to upload resource",
      });
    }
  }
);


// ============================================================
// DELETE RESOURCE
// ADMIN ONLY
// ============================================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {

    try {

      const { id } = req.params;

      console.log(
        "DELETE RESOURCE ID:",
        id
      );


      // ======================================================
      // VALIDATE ID
      // ======================================================

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid resource ID",
        });
      }


      // ======================================================
      // FIND RESOURCE
      // ======================================================

      const resource =
        await Resource.findById(id);


      if (!resource) {
        return res.status(404).json({
          success: false,
          message:
            "Resource not found",
        });
      }


      // ======================================================
      // DELETE CLOUDINARY FILE
      // ======================================================

      if (resource.filePublicId) {

        try {

          console.log(
            "Deleting Cloudinary file:",
            resource.filePublicId
          );


          await cloudinary.uploader.destroy(
            resource.filePublicId,
            {
              resource_type: "raw",
            }
          );


          console.log(
            "Cloudinary file deleted successfully"
          );

        } catch (
          cloudinaryError
        ) {

          console.error(
            "Cloudinary delete error:",
            cloudinaryError
          );

          // Continue MongoDB deletion
        }
      }


      // ======================================================
      // DELETE MONGODB RESOURCE
      // ======================================================

      await Resource.findByIdAndDelete(
        id
      );


      console.log(
        "MongoDB resource deleted:",
        id
      );


      // ======================================================
      // SUCCESS
      // ======================================================

      return res.status(200).json({
        success: true,
        message:
          "Resource deleted successfully",
      });

    } catch (error) {

      console.error(
        "DELETE RESOURCE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete resource",
      });
    }
  }
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;

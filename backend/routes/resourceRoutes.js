const express = require("express");
const mongoose = require("mongoose");

const Resource = require("../models/Resource");
const adminAuth = require("../middleware/adminAuth");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ==========================================
// CONSTANTS
// ==========================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

// ==========================================
// HELPER - ESCAPE REGEX
// ==========================================

const escapeRegex = (value = "") => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// ==========================================
// GET ALL RESOURCES
// GET /api/resources
// ==========================================

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
    console.error(
      "GET ALL RESOURCES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load resources",
    });
  }
});

// ==========================================
// GET RESOURCES BY BRANCH + CATEGORY
// IMPORTANT: keep before /branch/:branch
//
// GET
// /api/resources/branch/Computer%20Science/category/Notes
// ==========================================

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

      // --------------------------------------
      // VALIDATE BRANCH
      // --------------------------------------

      if (!ALLOWED_BRANCHES.includes(branch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
          allowedBranches: ALLOWED_BRANCHES,
        });
      }

      // --------------------------------------
      // VALIDATE CATEGORY
      // --------------------------------------

      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
          allowedCategories: ALLOWED_CATEGORIES,
        });
      }

      // --------------------------------------
      // FIND
      // --------------------------------------

      const resources = await Resource.find({
        branch,
        category,
      })
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        branch,
        category,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "BRANCH CATEGORY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load branch resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY BRANCH
//
// GET /api/resources/branch/Computer%20Science
// ==========================================

router.get(
  "/branch/:branch",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      ).trim();

      if (!ALLOWED_BRANCHES.includes(branch)) {
        return res.status(400).json({
          success: false,
          message: "Invalid branch",
          allowedBranches: ALLOWED_BRANCHES,
        });
      }

      const resources = await Resource.find({
        branch,
      })
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        branch,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "BRANCH RESOURCES ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load branch resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY CATEGORY
//
// GET /api/resources/category/Notes
// GET /api/resources/category/PYQ
// GET /api/resources/category/Syllabus
// GET /api/resources/category/Ebooks
// ==========================================

router.get(
  "/category/:category",
  async (req, res) => {
    try {
      const category = decodeURIComponent(
        req.params.category
      ).trim();

      const matchedCategory =
        ALLOWED_CATEGORIES.find(
          (item) =>
            item.toLowerCase() ===
            category.toLowerCase()
        );

      if (!matchedCategory) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
          allowedCategories:
            ALLOWED_CATEGORIES,
        });
      }

      const resources = await Resource.find({
        category: matchedCategory,
      })
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
        category: matchedCategory,
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

// ==========================================
// GET RESOURCES BY SEMESTER
//
// GET /api/resources/semester/1st%20Semester
// ==========================================

router.get(
  "/semester/:semester",
  async (req, res) => {
    try {
      const semester = decodeURIComponent(
        req.params.semester
      ).trim();

      if (!semester) {
        return res.status(400).json({
          success: false,
          message: "Semester is required",
        });
      }

      const resources = await Resource.find({
        semester: {
          $regex: `^${escapeRegex(semester)}$`,
          $options: "i",
        },
      })
        .populate(
          "uploadedBy",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

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

// ==========================================
// SEARCH RESOURCES
//
// GET /api/resources/search/:keyword
// ==========================================

router.get(
  "/search/:keyword",
  async (req, res) => {
    try {
      const keyword = decodeURIComponent(
        req.params.keyword
      ).trim();

      if (!keyword) {
        return res.status(400).json({
          success: false,
          message: "Search keyword is required",
        });
      }

      const safeKeyword =
        escapeRegex(keyword);

      const resources =
        await Resource.find({
          $or: [
            {
              title: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
            {
              subject: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
            {
              description: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
            {
              branch: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
            {
              semester: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
            {
              fileName: {
                $regex: safeKeyword,
                $options: "i",
              },
            },
          ],
        })
          .populate(
            "uploadedBy",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

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

// ==========================================
// DELETE RESOURCE
// ADMIN ONLY
//
// DELETE /api/resources/:id
// ==========================================

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

      // --------------------------------------
      // VALIDATE OBJECT ID
      // --------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // --------------------------------------
      // FIND RESOURCE
      // --------------------------------------

      const resource =
        await Resource.findById(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // --------------------------------------
      // DELETE CLOUDINARY FILE
      // --------------------------------------

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
        } catch (cloudinaryError) {
          console.error(
            "CLOUDINARY DELETE ERROR:",
            cloudinaryError
          );

          // MongoDB deletion will continue.
        }
      }

      // --------------------------------------
      // DELETE MONGODB DOCUMENT
      // --------------------------------------

      await Resource.findByIdAndDelete(id);

      console.log(
        "MongoDB resource deleted:",
        id
      );

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

// ==========================================
// EXPORT
// ==========================================

module.exports = router;

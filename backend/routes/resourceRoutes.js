const express = require("express");
const mongoose = require("mongoose");

const Resource = require("../models/Resource");
const adminAuth = require("../middleware/adminAuth");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ==========================================
// ALLOWED BRANCHES
// ==========================================

const ALLOWED_BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

// ==========================================
// ALLOWED CATEGORIES
// ==========================================

const ALLOWED_CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

// ==========================================
// GET ALL RESOURCES
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
// GET RESOURCES BY BRANCH
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

      const resources =
        await Resource.find({
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
        "GET BRANCH RESOURCES ERROR:",
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
// GET RESOURCES BY BRANCH + CATEGORY
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
          allowedCategories:
            ALLOWED_CATEGORIES,
        });
      }

      const resources =
        await Resource.find({
          branch,
          category: {
            $regex: `^${category}$`,
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
          "Failed to load branch category resources",
      });
    }
  }
);

// ==========================================
// GET RESOURCES BY CATEGORY
// ==========================================

router.get(
  "/category/:category",
  async (req, res) => {
    try {
      const category = decodeURIComponent(
        req.params.category
      ).trim();

      if (!ALLOWED_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category",
          allowedCategories:
            ALLOWED_CATEGORIES,
        });
      }

      const resources =
        await Resource.find({
          category: {
            $regex: `^${category}$`,
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
// ==========================================

router.get(
  "/semester/:semester",
  async (req, res) => {
    try {
      const semester = decodeURIComponent(
        req.params.semester
      ).trim();

      const resources =
        await Resource.find({
          semester: {
            $regex: `^${semester}$`,
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
// GET RESOURCES BY BRANCH + SEMESTER
// ==========================================

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

      const resources =
        await Resource.find({
          branch,
          semester: {
            $regex: `^${semester}$`,
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

// ==========================================
// GET BRANCH + SEMESTER + CATEGORY
// ==========================================

router.get(
  "/branch/:branch/semester/:semester/category/:category",
  async (req, res) => {
    try {
      const branch = decodeURIComponent(
        req.params.branch
      ).trim();

      const semester = decodeURIComponent(
        req.params.semester
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

      const resources =
        await Resource.find({
          branch,

          semester: {
            $regex: `^${semester}$`,
            $options: "i",
          },

          category: {
            $regex: `^${category}$`,
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
        branch,
        semester,
        category,
        count: resources.length,
        resources,
      });
    } catch (error) {
      console.error(
        "BRANCH SEMESTER CATEGORY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load resources",
      });
    }
  }
);

// ==========================================
// SEARCH RESOURCES
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

      const regex = {
        $regex: keyword,
        $options: "i",
      };

      const resources =
        await Resource.find({
          $or: [
            { title: regex },
            { description: regex },
            { subject: regex },
            { branch: regex },
            { semester: regex },
            { category: regex },
            { fileName: regex },
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
// ==========================================

router.delete(
  "/:id",
  adminAuth,
  async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        "================================="
      );

      console.log(
        "DELETE RESOURCE REQUEST"
      );

      console.log(
        "RESOURCE ID:",
        id
      );

      console.log(
        "================================="
      );

      // ======================================
      // VALIDATE MONGODB ID
      // ======================================

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // ======================================
      // FIND RESOURCE
      // ======================================

      const resource =
        await Resource.findById(id);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // ======================================
      // DELETE CLOUDINARY FILE
      // ======================================

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

          // We don't stop MongoDB deletion
          // if Cloudinary deletion fails.
        }
      }

      // ======================================
      // DELETE MONGODB RESOURCE
      // ======================================

      await Resource.findByIdAndDelete(id);

      console.log(
        "MongoDB resource deleted:",
        id
      );

      // ======================================
      // SUCCESS
      // ======================================

      return res.status(200).json({
        success: true,
        message:
          "Resource deleted successfully",
        resourceId: id,
      });
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "DELETE RESOURCE ERROR:",
        error
      );

      console.error(
        "================================="
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

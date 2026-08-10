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
      "Get resources error:",
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
      "Branch resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load branch resources",
    });
  }
});

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

      const resources =
        await Resource.find({
          branch: branch,

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
        "Branch category error:",
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
// GET RESOURCES BY CATEGORY
// ==========================================

router.get(
  "/category/:category",
  async (req, res) => {
    try {
      const category =
        decodeURIComponent(
          req.params.category
        ).trim();

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
        "Category resources error:",
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
      const semester =
        decodeURIComponent(
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
        count: resources.length,
        resources,
      });

    } catch (error) {
      console.error(
        "Semester resources error:",
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
// ==========================================

router.get(
  "/search/:keyword",
  async (req, res) => {
    try {
      const keyword =
        decodeURIComponent(
          req.params.keyword
        ).trim();

      const resources =
        await Resource.find({
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
        "Search resources error:",
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
        "DELETE RESOURCE ID:",
        id
      );

      // ======================================
      // VALIDATE ID
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
            "Cloudinary file deleted"
          );

        } catch (cloudinaryError) {
          console.error(
            "Cloudinary delete error:",
            cloudinaryError
          );
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

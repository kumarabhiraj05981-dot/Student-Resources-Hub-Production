const express = require("express");
const Resource = require("../models/Resource");

const router = express.Router();


// ==========================================
// GET ALL RESOURCES
// ==========================================
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {
    console.error("Get resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load resources",
    });
  }
});


// ======================================
// GET RESOURCES BY CATEGORY
// ======================================

router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.trim();

    const resources = await Resource.find({
      category: {
        $regex: `^${category}$`,
        $options: "i",
      },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {
    console.error("Get category resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load category resources",
    });
  }
});

// ==========================================
// GET RESOURCES BY SEMESTER
// ==========================================
router.get("/semester/:semester", async (req, res) => {
  try {

    const semester = decodeURIComponent(req.params.semester).trim();

    const resources = await Resource.find({
      semester: {
        $regex: `^${semester}$`,
        $options: "i",
      },
    })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {

    console.error("Semester resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load semester resources",
    });
  }
});


// ==========================================
// SEARCH RESOURCES
// ==========================================
router.get("/search/:keyword", async (req, res) => {
  try {

    const keyword = decodeURIComponent(req.params.keyword).trim();

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
      ],
    }).sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {

    console.error("Search resources error:", error);

    res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
});


module.exports = router;
const express = require("express");
const Resource = require("../models/Resource");

const router = express.Router();

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
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

// Get resources by category
router.get("/category/:category", async (req, res) => {
  try {
    const resources = await Resource.find({
      category: req.params.category,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Category resources error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load resources",
    });
  }
});

module.exports = router;
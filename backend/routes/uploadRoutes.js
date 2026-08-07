const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");
const Resource = require("../models/Resource");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student-resources",
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Upload route is working"
  });
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("UPLOAD BODY:", req.body);
    console.log("UPLOAD FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const { title, description, category, subject } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }

    const resource = new Resource({
      title: title.trim(),
      description: description || "",
      category,
      subject: subject || "",
      fileUrl: req.file.path,
      filePublicId: req.file.filename || "",
      fileName: req.file.originalname || "",
    });

    await resource.save();

    console.log("RESOURCE SAVED:", resource);

    return res.status(201).json({
      success: true,
      message: "Resource uploaded and saved successfully!",
      resource: resource,
    });
  } catch (error) {
    console.error("RESOURCE UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Resource upload failed",
    });
  }
});

module.exports = router;
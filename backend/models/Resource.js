const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    semester: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Notes", "PYQ", "Syllabus", "Ebooks", "Other"],
    },

    subject: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    filePublicId: {
      type: String,
      default: "",
    },

    fileName: {
      type: String,
      default: "",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);
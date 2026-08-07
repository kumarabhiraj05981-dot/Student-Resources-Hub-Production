const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["notes", "pyq", "syllabus", "ebooks"],
      required: true,
    },

    semester: {
      type: Number,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    pdfUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);
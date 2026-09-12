const mongoose = require("mongoose");


// ======================================
// QUESTION SCHEMA
// ======================================

const questionSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [String],
      default: [],
    },

    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);


// ======================================
// AI PAPER SCHEMA
// ======================================

const aiPaperSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "AI Generated Question Paper",
    },

    subject: {
      type: String,
      required: true,
    },

    unit: {
      type: String,
      default: "Full Syllabus",
    },

    difficulty: {
      type: String,
      default: "Medium",
    },

    questionType: {
      type: String,
      default: "Mixed",
    },

    questionCount: {
      type: Number,
      required: true,
    },

    questions: {
      type: [questionSchema],
      required: true,
      validate: {
        validator: function (questions) {
          return questions && questions.length > 0;
        },
        message: "At least one question is required",
      },
    },
  },
  {
    timestamps: true,
  }
);


// ======================================
// MODEL
// ======================================

module.exports = mongoose.model(
  "AIPaper",
  aiPaperSchema
);
const express = require("express");
const router = express.Router();

const { GoogleGenAI, Type } = require("@google/genai");

const AIPaper = require("../models/AIPaper");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

// ======================================
// GEMINI CONFIG
// ======================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-3.6-flash";

// ======================================
// HELPER FUNCTIONS
// ======================================

function normalizeQuestionType(type) {
  const value = String(type || "")
    .trim()
    .toLowerCase();

  if (
    value === "mcq" ||
    value === "multiple choice" ||
    value === "multiple-choice"
  ) {
    return "MCQ";
  }

  if (
    value === "short answer" ||
    value === "short-answer" ||
    value === "short"
  ) {
    return "Short Answer";
  }

  if (
    value === "long answer" ||
    value === "long-answer" ||
    value === "long"
  ) {
    return "Long Answer";
  }

  return type
    ? String(type).trim()
    : "MCQ";
}


function normalizeRequestedType(type) {
  const value = String(type || "")
    .trim()
    .toLowerCase();

  if (
    value === "mcq" ||
    value === "multiple choice" ||
    value === "multiple-choice"
  ) {
    return "MCQ";
  }

  if (
    value === "short answer" ||
    value === "short-answer" ||
    value === "short"
  ) {
    return "Short Answer";
  }

  if (
    value === "long answer" ||
    value === "long-answer" ||
    value === "long"
  ) {
    return "Long Answer";
  }

  if (value === "mixed") {
    return "Mixed";
  }

  return "Mixed";
}


function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  );
}


function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


// ======================================
// VALIDATE + CLEAN AI QUESTIONS
// ======================================

function validateAndCleanQuestions(
  questions,
  settings
) {
  if (!Array.isArray(questions)) {
    throw new Error(
      "Gemini did not return a valid questions array"
    );
  }

  if (
    questions.length !==
    settings.questionCount
  ) {
    throw new Error(
      `Gemini generated ${questions.length} questions instead of ${settings.questionCount}. Please try again.`
    );
  }

  const seenQuestions = new Set();

  const cleanedQuestions = [];

  for (
    let index = 0;
    index < questions.length;
    index++
  ) {
    const item = questions[index];

    const questionText = String(
      item?.question || ""
    ).trim();

    if (!questionText) {
      throw new Error(
        `Question ${index + 1} has no question text`
      );
    }

    // ======================================
    // DUPLICATE QUESTION CHECK
    // ======================================

    const normalizedQuestion =
      normalizeText(questionText);

    if (
      seenQuestions.has(
        normalizedQuestion
      )
    ) {
      throw new Error(
        `Duplicate question detected at question ${index + 1}. Please generate again.`
      );
    }

    seenQuestions.add(
      normalizedQuestion
    );

    // ======================================
    // QUESTION TYPE
    // ======================================

    const type =
      normalizeQuestionType(
        item?.type
      );

    // ======================================
    // OPTIONS
    // ======================================

    let options = [];

    if (Array.isArray(item?.options)) {
      options = item.options
        .map((option) =>
          String(option || "").trim()
        )
        .filter(Boolean);
    }

    // ======================================
    // ANSWER
    // ======================================

    const answer =
      typeof item?.answer === "string"
        ? item.answer.trim()
        : String(item?.answer || "").trim();

    // ======================================
    // ANSWER REQUIRED
    // ======================================

    if (isEmpty(answer)) {
      throw new Error(
        `Question ${index + 1} does not have a valid answer`
      );
    }

    // ======================================
    // MCQ VALIDATION
    // ======================================

    if (type === "MCQ") {
      if (options.length !== 4) {
        throw new Error(
          `MCQ question ${index + 1} must have exactly 4 options`
        );
      }

      // Check duplicate options
      const normalizedOptions =
        options.map((option) =>
          normalizeText(option)
        );

      const uniqueOptions =
        new Set(normalizedOptions);

      if (
        uniqueOptions.size !== 4
      ) {
        throw new Error(
          `MCQ question ${index + 1} contains duplicate options`
        );
      }

      // Answer must exactly match one option
      const answerExists =
        options.some(
          (option) =>
            option.trim() ===
            answer.trim()
        );

      if (!answerExists) {
        throw new Error(
          `MCQ question ${index + 1} answer does not match any option`
        );
      }
    } else {
      // Non-MCQ questions should not need options
      options = [];
    }

    // ======================================
    // REQUESTED TYPE VALIDATION
    // ======================================

    if (
      settings.questionType === "MCQ" &&
      type !== "MCQ"
    ) {
      throw new Error(
        `Question ${index + 1} is not an MCQ as requested`
      );
    }

    if (
      settings.questionType ===
        "Short Answer" &&
      type !== "Short Answer"
    ) {
      throw new Error(
        `Question ${index + 1} is not a Short Answer question as requested`
      );
    }

    if (
      settings.questionType ===
        "Long Answer" &&
      type !== "Long Answer"
    ) {
      throw new Error(
        `Question ${index + 1} is not a Long Answer question as requested`
      );
    }

    // ======================================
    // FINAL QUESTION
    // ======================================

    cleanedQuestions.push({
      number: index + 1,

      type,

      question: questionText,

      options,

      answer,
    });
  }

  // ======================================
  // MIXED TYPE VALIDATION
  // ======================================

  if (
    settings.questionType === "Mixed" &&
    settings.questionCount >= 3
  ) {
    const types = new Set(
      cleanedQuestions.map(
        (question) => question.type
      )
    );

    if (types.size < 2) {
      throw new Error(
        "Mixed mode must contain different question types"
      );
    }
  }

  return cleanedQuestions;
}


// ======================================
// GENERATE + SAVE AI QUESTION PAPER
// ======================================

router.post(
  "/generate-paper",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        subject,
        unit,
        difficulty,
        questionCount,
        questionType,
      } = req.body;

      // ======================================
      // VALIDATION
      // ======================================

      if (
        !subject ||
        String(subject).trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }

      if (!process.env.GEMINI_API_KEY) {
        console.error(
          "GEMINI_API_KEY is missing"
        );

        return res.status(500).json({
          success: false,
          message:
            "Gemini API key is not configured on server",
        });
      }

      const settings = {
        subject: String(subject).trim(),

        unit:
          unit &&
          String(unit).trim()
            ? String(unit).trim()
            : "Full Syllabus",

        difficulty:
          difficulty &&
          String(difficulty).trim()
            ? String(difficulty).trim()
            : "Medium",

        questionCount:
          Number(questionCount) || 20,

        questionType:
          normalizeRequestedType(
            questionType
          ),
      };

      // ======================================
      // QUESTION COUNT LIMIT
      // ======================================

      if (
        !Number.isInteger(
          settings.questionCount
        ) ||
        settings.questionCount < 1 ||
        settings.questionCount > 50
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question count must be a whole number between 1 and 50",
        });
      }

      console.log(
        "================================="
      );

      console.log(
        "GEMINI PAPER REQUEST"
      );

      console.log({
        userId: req.user._id,
        userName: req.user.name,
        ...settings,
      });

      console.log(
        "Model:",
        GEMINI_MODEL
      );

      console.log(
        "================================="
      );

      // ======================================
      // AI PROMPT
      // ======================================

      const prompt = `
You are an expert educational question-paper generator.

Create a high-quality practice question paper.

Subject: ${settings.subject}
Unit: ${settings.unit}
Difficulty: ${settings.difficulty}
Number of Questions: ${settings.questionCount}
Question Type: ${settings.questionType}

IMPORTANT RULES:

1. Generate EXACTLY ${settings.questionCount} questions.
2. Every question must be unique.
3. Do not repeat or rephrase the same question.
4. Every question MUST have a real, correct answer.
5. Never leave the answer empty.
6. Never use placeholders such as "Answer not provided".
7. Never use "N/A" as an answer.
8. Keep every question relevant to the subject.
9. Keep every question relevant to the selected unit.
10. Keep the requested difficulty level.
11. Use clear, student-friendly language.
12. Return ONLY valid JSON.
13. Do not return Markdown.
14. Do not return explanations outside JSON.

QUESTION TYPE RULES:

If Question Type is MCQ:
- Every question must have type "MCQ".
- Every MCQ must have exactly 4 options.
- All 4 options must be different.
- The answer must EXACTLY match one of the option texts.
- Do not use A, B, C or D alone as the answer.
- Put the complete correct option text in answer.

If Question Type is Short Answer:
- Every question must have type "Short Answer".
- Do not provide options.
- options must be an empty array.
- Give a concise but correct answer.

If Question Type is Long Answer:
- Every question must have type "Long Answer".
- Do not provide options.
- options must be an empty array.
- Give a useful model answer suitable for a student examination.

If Question Type is Mixed:
- Use a mixture of MCQ, Short Answer and Long Answer.
- For ${settings.questionCount} or more questions, use at least two different question types.
- MCQ questions must follow all MCQ rules.
- Short Answer questions must have concise answers.
- Long Answer questions must have useful model answers.

Return exactly this JSON structure:

{
  "title": "AI Generated Question Paper",
  "subject": "${settings.subject}",
  "unit": "${settings.unit}",
  "difficulty": "${settings.difficulty}",
  "questions": [
    {
      "number": 1,
      "type": "MCQ",
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Option A"
    }
  ]
}

For a Short Answer question:

{
  "number": 2,
  "type": "Short Answer",
  "question": "Question text",
  "options": [],
  "answer": "Correct concise answer"
}

For a Long Answer question:

{
  "number": 3,
  "type": "Long Answer",
  "question": "Question text",
  "options": [],
  "answer": "Detailed model answer"
}

The answer property is REQUIRED for EVERY question.
The question property is REQUIRED for EVERY question.
The type property is REQUIRED for EVERY question.
The options property must be [] for non-MCQ questions.
`;


      // ======================================
      // GEMINI STRUCTURED OUTPUT SCHEMA
      // ======================================

      const questionSchema = {
        type: Type.OBJECT,

        properties: {
          number: {
            type: Type.INTEGER,
          },

          type: {
            type: Type.STRING,
          },

          question: {
            type: Type.STRING,
          },

          options: {
            type: Type.ARRAY,

            items: {
              type: Type.STRING,
            },
          },

          answer: {
            type: Type.STRING,
          },
        },

        required: [
          "number",
          "type",
          "question",
          "answer",
        ],
      };


      const paperSchema = {
        type: Type.OBJECT,

        properties: {
          title: {
            type: Type.STRING,
          },

          subject: {
            type: Type.STRING,
          },

          unit: {
            type: Type.STRING,
          },

          difficulty: {
            type: Type.STRING,
          },

          questions: {
            type: Type.ARRAY,

            items: questionSchema,
          },
        },

        required: [
          "title",
          "subject",
          "unit",
          "difficulty",
          "questions",
        ],
      };


      // ======================================
      // CALL GEMINI
      // ======================================

      console.log(
        "Sending request to Gemini..."
      );

      const response =
        await ai.models.generateContent({
          model: GEMINI_MODEL,

          contents: prompt,

          config: {
            responseMimeType:
              "application/json",

            responseSchema:
              paperSchema,

            systemInstruction:
              "You are an expert educational question-paper generator. Always return valid structured JSON and provide a real answer for every question.",
          },
        });


      // ======================================
      // READ GEMINI RESPONSE
      // ======================================

      const aiText =
        response?.text;

      if (!aiText) {
        console.error(
          "GEMINI EMPTY RESPONSE:",
          response
        );

        return res.status(502).json({
          success: false,
          message:
            "Gemini returned an empty response. Please try again.",
        });
      }

      console.log(
        "GEMINI RESPONSE RECEIVED"
      );


      // ======================================
      // PARSE JSON
      // ======================================

      let paper;

      try {
        paper = JSON.parse(aiText);
      } catch (error) {
        console.error(
          "GEMINI JSON PARSE ERROR:",
          error
        );

        console.error(
          "GEMINI RESPONSE:",
          aiText
        );

        return res.status(502).json({
          success: false,
          message:
            "Gemini returned invalid question paper data. Please try again.",
        });
      }


      // ======================================
      // PAPER FORMAT CHECK
      // ======================================

      if (
        !paper ||
        typeof paper !== "object" ||
        !Array.isArray(
          paper.questions
        )
      ) {
        return res.status(502).json({
          success: false,
          message:
            "Invalid question paper format returned by Gemini.",
        });
      }


      // ======================================
      // VALIDATE + CLEAN QUESTIONS
      // ======================================

      let cleanedQuestions;

      try {
        cleanedQuestions =
          validateAndCleanQuestions(
            paper.questions,
            settings
          );
      } catch (validationError) {
        console.error(
          "AI PAPER VALIDATION ERROR:",
          validationError.message
        );

        return res.status(502).json({
          success: false,
          message:
            validationError.message ||
            "Gemini generated an invalid question paper. Please try again.",
        });
      }


      // ======================================
      // SAVE PAPER TO MONGODB
      // ======================================

      const savedPaper =
        await AIPaper.create({
          user: req.user._id,

          title:
            paper.title ||
            "AI Generated Question Paper",

          subject:
            paper.subject ||
            settings.subject,

          unit:
            paper.unit ||
            settings.unit,

          difficulty:
            paper.difficulty ||
            settings.difficulty,

          questionType:
            settings.questionType,

          questionCount:
            cleanedQuestions.length,

          questions:
            cleanedQuestions,
        });


      // ======================================
      // SUCCESS LOG
      // ======================================

      console.log(
        "================================="
      );

      console.log(
        "GEMINI PAPER SAVED SUCCESSFULLY"
      );

      console.log(
        "Paper ID:",
        savedPaper._id
      );

      console.log(
        "User ID:",
        req.user._id
      );

      console.log(
        "Questions:",
        savedPaper.questions.length
      );

      console.log(
        "================================="
      );


      // ======================================
      // SEND PAPER TO FRONTEND
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Question paper generated and saved successfully",

        paper: {
          _id: savedPaper._id,

          title:
            savedPaper.title,

          subject:
            savedPaper.subject,

          unit:
            savedPaper.unit,

          difficulty:
            savedPaper.difficulty,

          questionType:
            savedPaper.questionType,

          questionCount:
            savedPaper.questionCount,

          questions:
            savedPaper.questions,

          createdAt:
            savedPaper.createdAt,
        },
      });

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "GEMINI PAPER ERROR:",
        error
      );

      console.error(
        "================================="
      );

      return res.status(500).json({
        success: false,

        message:
          error?.message ||
          "Failed to generate question paper",
      });
    }
  }
);


// ======================================
// GET MY SAVED AI QUESTION PAPERS
// ======================================

router.get(
  "/my-papers",
  authMiddleware,
  async (req, res) => {
    try {
      const papers =
        await AIPaper.find({
          user: req.user._id,
        })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: papers.length,
        papers,
      });

    } catch (error) {
      console.error(
        "GET SAVED PAPERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to load saved question papers",
      });
    }
  }
);


module.exports = router;

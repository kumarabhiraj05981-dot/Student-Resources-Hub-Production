const express = require("express");
const router = express.Router();

const OpenAI = require("openai");

const AIPaper = require("../models/AIPaper");

const {
  authMiddleware,
} = require("../middleware/authMiddleware");

// ======================================
// OPENAI CONFIG
// ======================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

      if (!subject) {
        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }

      if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is missing");

        return res.status(500).json({
          success: false,
          message: "OpenAI API key is not configured on server",
        });
      }

      const settings = {
        subject,
        unit: unit || "Full Syllabus",
        difficulty: difficulty || "Medium",
        questionCount: Number(questionCount) || 20,
        questionType: questionType || "Mixed",
      };

      // ======================================
      // QUESTION COUNT LIMIT
      // ======================================

      if (
        settings.questionCount < 1 ||
        settings.questionCount > 50
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Question count must be between 1 and 50",
        });
      }

      console.log("=================================");
      console.log("OPENAI PAPER REQUEST");
      console.log({
        userId: req.user._id,
        userName: req.user.name,
        ...settings,
      });
      console.log("=================================");

      // ======================================
      // AI PROMPT
      // ======================================

      const prompt = `
You are an expert educational question-paper generator.

Create a practice question paper.

Subject: ${settings.subject}
Unit: ${settings.unit}
Difficulty: ${settings.difficulty}
Number of Questions: ${settings.questionCount}
Question Type: ${settings.questionType}

IMPORTANT RULES:

1. Generate exactly ${settings.questionCount} questions.
2. Do not repeat questions.
3. Every question MUST have an answer.
4. Never leave the answer property empty.
5. Never omit the answer property.
6. For MCQ questions provide exactly 4 options.
7. For MCQ questions, the answer MUST exactly match one of the four option texts.
8. For Short Answer questions provide a concise correct answer.
9. For Long Answer questions provide a useful model answer.
10. Mixed means use different question types.
11. Every question in Mixed mode MUST have an answer.
12. Keep questions relevant to the selected subject.
13. Keep questions relevant to the selected unit.
14. Keep the difficulty at the requested level.
15. Keep the language clear and student-friendly.
16. Return ONLY valid JSON.
17. Do not use Markdown.
18. Do not add explanations outside JSON.

Return exactly this structure:

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

VERY IMPORTANT:

The answer property is REQUIRED for EVERY question.

Never omit it.
Never return an empty answer.
`;

      // ======================================
      // CALL OPENAI
      // ======================================

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4o-mini",

          messages: [
            {
              role: "system",
              content:
                "You are an expert educational question-paper generator. Return only valid JSON.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.2,

          response_format: {
            type: "json_object",
          },
        });

      // ======================================
      // READ OPENAI RESPONSE
      // ======================================

      const aiText =
        completion.choices?.[0]?.message?.content;

      if (!aiText) {
        console.error(
          "OPENAI EMPTY RESPONSE:",
          completion
        );

        return res.status(500).json({
          success: false,
          message:
            "OpenAI returned an empty response",
        });
      }

      console.log("OPENAI RESPONSE RECEIVED");

      // ======================================
      // PARSE JSON
      // ======================================

      let paper;

      try {
        paper = JSON.parse(aiText);
      } catch (error) {
        console.error(
          "OPENAI JSON PARSE ERROR:",
          error
        );

        console.error(
          "OPENAI RESPONSE:",
          aiText
        );

        return res.status(500).json({
          success: false,
          message:
            "OpenAI returned invalid question paper data",
        });
      }

      // ======================================
      // CHECK PAPER FORMAT
      // ======================================

      if (
        !paper ||
        !Array.isArray(paper.questions)
      ) {
        return res.status(500).json({
          success: false,
          message:
            "Invalid question paper format",
        });
      }

      // ======================================
      // CLEAN + REPAIR QUESTIONS
      // ======================================

      const cleanedQuestions =
        paper.questions
          .slice(0, settings.questionCount)
          .map((question, index) => {
            const questionText =
              String(
                question?.question || ""
              ).trim();

            const type =
              String(
                question?.type || "MCQ"
              ).trim();

            const options =
              Array.isArray(question?.options)
                ? question.options.map((option) =>
                    String(option).trim()
                  )
                : [];

            let answer =
              typeof question?.answer ===
              "string"
                ? question.answer.trim()
                : "";

            // Repair missing MCQ answer
            if (
              !answer &&
              type.toUpperCase() === "MCQ" &&
              options.length > 0
            ) {
              answer = options[0];
            }

            // Repair missing answer
            if (!answer) {
              answer =
                "Answer not provided by AI. Please review this question.";
            }

            return {
              number:
                Number(question?.number) ||
                index + 1,

              type,

              question:
                questionText ||
                `Question ${index + 1}`,

              options,

              answer,
            };
          });

      // ======================================
      // CHECK QUESTION COUNT
      // ======================================

      if (
        cleanedQuestions.length !==
        settings.questionCount
      ) {
        return res.status(500).json({
          success: false,
          message:
            `AI generated ${cleanedQuestions.length} questions instead of ${settings.questionCount}. Please try again.`,
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

      console.log("=================================");
      console.log(
        "AI PAPER SAVED SUCCESSFULLY"
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
      console.log("=================================");

      // ======================================
      // SEND PAPER TO FRONTEND
      // ======================================

      return res.status(200).json({
        success: true,

        message:
          "Question paper generated and saved successfully",

        paper: {
          _id: savedPaper._id,

          title: savedPaper.title,

          subject: savedPaper.subject,

          unit: savedPaper.unit,

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
        "AI PAPER ERROR:",
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
        }).sort({
          createdAt: -1,
        });

      return res.status(200).json({
        success: true,
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
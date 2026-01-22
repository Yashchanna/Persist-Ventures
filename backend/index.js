const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   AI COURSE GENERATOR (MOCK)
================================ */
app.post("/generate-course", (req, res) => {
  const { age, language, subject } = req.body;

  const course = {
    title: `${subject} Course for Age ${age} (${language})`,
    modules: [
      {
        name: "Basics",
        lessons: [
          `Introduction to ${subject}`,
          `${subject} fundamentals`,
          `Simple examples`,
        ],
      },
      {
        name: "Practice",
        lessons: [
          `Quiz on ${subject}`,
          `Games for learning`,
          `Mini project`,
        ],
      },
    ],
  };

  res.json(course);
});

/* ===============================
   ADAPTIVE LEARNING ENGINE
================================ */
app.post("/get-lesson", (req, res) => {
  const { performance } = req.body;

  let lessonType = "video";

  if (performance === "good") lessonType = "quiz";
  if (performance === "bad") lessonType = "video";

  res.json({
    lessonType,
    content:
      lessonType === "quiz"
        ? {
            question: "What is 2 + 2?",
            options: ["3", "4", "5"],
            answer: "4",
          }
        : {
            title: "Addition Basics",
            video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          },
  });
});

/* ===============================
   AI TUTOR (HINT BASED)
================================ */
app.post("/ai-tutor", (req, res) => {
  const { question } = req.body;

  const hints = [
    "Try breaking the problem into smaller steps.",
    "What information do you already know that can help here?",
    "Think about which formula or rule might apply.",
    "Can you try solving a simpler version of this first?",
    "Look for patterns in the numbers or words.",
  ];

  const randomHint = hints[Math.floor(Math.random() * hints.length)];

  res.json({
    reply: randomHint,
  });
});

/* ===============================
   SERVER START
================================ */
app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});

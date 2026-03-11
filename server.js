import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyCSIj39wqvbzZap93KEBdf7gQK8ZOqu2b8";

// health check
app.get("/", (req, res) => {
  res.json({ status: "Gemini AI server running" });
});

// AI endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful Indian legal assistant. Provide only general legal information, not professional advice.\n\nUser question: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

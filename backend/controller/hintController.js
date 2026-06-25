import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

console.log("hintController.js loaded successfully!");
console.log("API Key exists:", !!GEMINI_API_KEY);
console.log("AI initialized:", !!ai);

export const generateHint = async (req, res) => {
  try {
    console.log("📝 Generating hint...");
    const { question, correctAnswerIndex, options } = req.body;

    if (!question || correctAnswerIndex === undefined || !options) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!GEMINI_API_KEY || !ai) {
      return res.status(500).json({
        success: false,
        message: "Gemini API not configured"
      });
    }

    const correctAnswer = options[correctAnswerIndex];
    
    const prompt = `Generate a brief helpful hint (2-3 sentences) for this quiz question. Guide to answer WITHOUT revealing it.

Question: ${question}
Options:
${options.map((opt, idx) => `${idx + 1}. ${opt}`).join('\n')}

Provide ONLY the hint text.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const hint = response.text.trim();

    return res.status(200).json({
      success: true,
      hint: hint,
      message: "Hint generated successfully"
    });

  } catch (error) {
    console.error("❌ Error in generateHint:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate hint",
      error: error.message // Shows more details
    });
  }
};

export const generateExplanation = async (req, res) => {
  try {
    const { question, options, correctAnswerIndex, userAnswerIndex } = req.body;

    if (!question || correctAnswerIndex === undefined || !options) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    if (!GEMINI_API_KEY || !ai) {
      return res.status(500).json({
        success: false,
        message: "Gemini API not configured"
      });
    }

    const correctAnswer = options[correctAnswerIndex];
    const userAnswer = userAnswerIndex !== undefined ? options[userAnswerIndex] : null;
    const isCorrect = userAnswerIndex === correctAnswerIndex;

    let prompt;
    if (isCorrect) {
      prompt = `Explain why this answer is correct (1-2 sentences).
Question: ${question}
Correct Answer: ${correctAnswer}`;
    } else {
      prompt = `Explain why this is wrong and correct answer (2-3 sentences).
Question: ${question}
User Answer: ${userAnswer}
Correct Answer: ${correctAnswer}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const explanation = response.text.trim();

    return res.status(200).json({
      success: true,
      explanation: explanation,
      isCorrect: isCorrect
    });

  } catch (error) {
    console.error("❌ Error in generateExplanation:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message // Shows more details
    });
  }
};
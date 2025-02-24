import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateCodeSolution = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });
    console.log("Model initialized:", model); // Log the model for debugging

    if (!model) {
      throw new Error("Model initialization failed. Please check the model name and configuration.");
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate solution");
  }
};
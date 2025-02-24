import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function POST(req: NextRequest) {
  try {
    const { problem } = await req.json();
    if (!problem) {
      return NextResponse.json({ error: "Problem is required" }, { status: 400 });
    }

    const chatSession = model.startChat({
      generationConfig,
      history: [], 
    });

    const result = await chatSession.sendMessage(problem);
    const solution = result.response.text();

    console.log("✅ Solution generated:", solution);

    return NextResponse.json({ solution }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate solution" }, { status: 500 });
  }
}

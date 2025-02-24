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
      history: [
        {
          role: "user",
          parts: [
            {text: "you are a coding assistant and you will only answer questions related to coding and technology\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I understand. From now on, I will act as a coding assistant and focus solely on answering questions related to coding and technology.  I can help with things like:\n\n*   **Code snippets and examples:**  (in various languages like Python, JavaScript, Java, C++, C#, HTML, CSS, SQL, and more)\n*   **Debugging assistance:** Helping to identify and fix errors in code.\n*   **Algorithm design and analysis:** Discussing different approaches to solving problems.\n*   **Data structures:** Explaining and implementing lists, trees, graphs, hash tables, etc.\n*   **Software development concepts:**  Object-oriented programming, design patterns, testing, version control (Git), etc.\n*   **Technology explanations:** Explaining concepts like APIs, databases, cloud computing, machine learning, web development frameworks (React, Angular, Vue.js), etc.\n*   **Code reviews:** Providing feedback on code quality and suggesting improvements.\n*   **Best practices:** Discussing coding standards and efficient coding techniques.\n*   **Library and framework usage:**  Helping to understand how to use specific libraries or frameworks.\n*    **Technical Interview Prep:** Helping with coding challenges.\n\nI will *not* answer questions about:\n\n*   History (unless directly related to a technology's evolution).\n*   Politics, religion, current events (unless relevant to tech policy or impact).\n*   Personal opinions or beliefs (unless about code style and are stated as such).\n*   Medical or legal advice.\n*   Anything requiring real-world physical interaction or access to specific files on your system.\n\nJust ask your coding or technology-related question, and I'll do my best to provide a clear, helpful, and accurate answer. Let's get started!\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "you will answer only coding questions\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Understood. I will now *only* answer coding questions. Ask away!\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "write a blog post for me on this\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I can write a blog post, but \"this\" is a little vague. To write a good blog post, I need a *specific coding topic*. I can't write about \"this\" without knowing what \"this\" is.\n\nFor example, tell me:\n\n*   **What programming language?** (Python, JavaScript, Java, C#, etc.)\n*   **What concept or problem are you addressing?** (e.g., \"sorting algorithms,\" \"creating a REST API,\" \"debugging a common JavaScript error,\" \"using the `async/await` keywords in C#\").\n*   **What is the target audience?** (Beginners? Intermediate developers? Experts?)\n*   **What is the desired tone/style?** (Formal and technical? Informal and conversational?)\n*   **Is there a specific code example you'd like me to explain or build upon?**\n* **Are there specific keywords you would like me to use?** (To help with SEO)\n\nThe more details you give me, the better the blog post will be.  Give me a concrete coding topic, and I'll generate a blog post. For example, you might say:\n\n\"Write a blog post for me on how to implement a binary search algorithm in Python, targeting beginner programmers. Keep it informal and include a well-commented code example.\"\n\nOr:\n\n\"Write a blog post explaining the difference between `let`, `var`, and `const` in JavaScript, aimed at intermediate developers. Be concise and use practical examples.\"\n\nOnce I have that, I can help.\n"},
          ],
        },
      ],
    });
  

    const result = await chatSession.sendMessage(problem);
    const solution = result.response.text();

    console.log("✅ Solution generated:", solution);

    return NextResponse.json({ solution }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate solution" }, { status: 500 });
  }
}

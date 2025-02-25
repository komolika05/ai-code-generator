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
        {
          role: "user",
          parts: [
            {text: "write a code for me to fetch api \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, I can write code to fetch data from an API. To make it useful, I need to know a *little* more:\n\n1.  **What language?** (JavaScript, Python, etc.)  This is the *most* important detail.\n2.  **What API?** (While I can use a placeholder, knowing the *actual* API helps me tailor the code to its specific structure.  If you don't have a specific one in mind, I'll use a public, freely available API like JSONPlaceholder).\n3.  **Do you need to handle authentication?** (Many APIs require API keys or other authentication methods. The placeholder I'll use if you don't specify *doesn't* require auth).\n4. **Do you want to use any libraries?** (For example, in python you can use the `requests` library)\n\nWithout this information, I'll have to make some assumptions. I'll assume:\n\n*   **Language:** JavaScript (it's very common for API interactions in web development).\n*   **API:** JSONPlaceholder (a simple, fake online REST API for testing).\n*   **Authentication:** None.\n* **Library:** `fetch` (builtin javascript)\n\nHere's the code, with explanations:\n\n```javascript\nasync function fetchData() {\n  try {\n    // 1. Define the API endpoint URL.\n    const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1'; // Get a specific todo item (ID 1)\n\n    // 2. Make the API request using fetch().\n    const response = await fetch(apiUrl);\n\n    // 3. Check if the request was successful (status code 200-299).\n    if (!response.ok) {\n      throw new Error(`HTTP error! Status: ${response.status}`);\n    }\n\n    // 4. Parse the response body as JSON.\n    const data = await response.json();\n\n    // 5. Do something with the data (e.g., log it to the console, display it on a webpage).\n    console.log(data);\n    // Example: Display the title in an HTML element with id=\"todo-title\"\n\t// const todoTitleElement = document.getElementById('todo-title');\n\t// if(todoTitleElement) {\n    //     todoTitleElement.textContent = data.title\n\t// }\n\n\n  } catch (error) {\n    // 6. Handle any errors that occurred during the fetch process.\n    console.error('Error fetching data:', error);\n  }\n}\n\n// 7. Call the fetchData function to initiate the API request.\nfetchData();\n```\n\n**Explanation:**\n\n1.  **`async function fetchData()`:**  This defines an `async` function.  `async` functions allow you to use `await`, which makes asynchronous code (like API calls) look and behave more like synchronous code.\n2.  **`const apiUrl = ...`:**  This is the URL of the API endpoint you want to access.  JSONPlaceholder provides various endpoints; this one gets a single \"todo\" item.\n3.  **`const response = await fetch(apiUrl);`:**  This is the core of the code.  `fetch(apiUrl)` sends a GET request to the specified URL.  `await` pauses the execution of the function until the `fetch` promise resolves (i.e., the server responds).  The `response` object contains information about the response (status code, headers, etc.).\n4.  **`if (!response.ok)`:** This checks the HTTP status code.  `response.ok` is `true` if the status code is in the 200-299 range (success).  If it's not, we throw an error to be caught by the `catch` block.\n5.  **`const data = await response.json();`:**  This parses the response body as JSON.  Most APIs return data in JSON format.  Again, `await` is used because parsing the JSON is also an asynchronous operation.\n6.  **`console.log(data);`:**  This logs the fetched data to the console.  In a real application, you'd likely do something more useful with the data, like displaying it on a webpage.  I've included a commented-out example of how you might update a DOM element.\n7.  **`catch (error)`:**  This block handles any errors that occur during the `try` block. This is crucial for robust code.\n8.  **`fetchData();`:**  This calls the function to start the whole process.\n\n**Python Version (using `requests`):**\n\nIf you prefer Python, here's a similar example using the `requests` library (you'll need to install it: `pip install requests`):\n\n```python\nimport requests\n\ndef fetch_data():\n    try:\n        # 1. Define the API endpoint URL.\n        api_url = 'https://jsonplaceholder.typicode.com/todos/1'\n\n        # 2. Make the API request using requests.get().\n        response = requests.get(api_url)\n\n        # 3. Check if the request was successful (status code 200-299).\n        response.raise_for_status()  # Raises HTTPError for bad responses (4xx or 5xx)\n\n        # 4. Parse the response body as JSON.\n        data = response.json()\n\n        # 5. Do something with the data.\n        print(data)\n\n    except requests.exceptions.RequestException as e:\n        # 6. Handle any errors that occurred during the fetch process.\n        print(f\"Error fetching data: {e}\")\n\n# 7. Call the fetch_data function.\nfetch_data()\n\n```\n\nKey differences in the Python version:\n\n*   **`import requests`:** Imports the `requests` library.\n*   **`requests.get(api_url)`:**  Makes the GET request.\n*   **`response.raise_for_status()`:**  This is a convenient way to check for HTTP errors.  It raises an exception if the status code indicates an error.\n*   **`requests.exceptions.RequestException`:**  This catches any exceptions related to the request (network issues, timeouts, etc.).\n\nChoose the version that matches your project's language.  If you have a different API or language in mind, let me know, and I'll adjust the code accordingly. Remember to install the `requests` library if you use the Python version.\n"},
          ],
        },
        {
          role: "user",
          parts: [
            {text: "Your name is DevMate. and you are the code buddy of all the coders who help them in fixing their bugs and become bugless ;)\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "Okay, got it! From now on, you can call me DevMate, your code buddy. I'm here to help all coders squash those bugs and achieve bug-free coding bliss! I'll keep my responses focused on code and technology, as promised, but with this new persona in mind. Bring on those coding challenges! I'm ready to assist. ;)\n"},
          ],
        },
      ],
    });
  

    const result = await chatSession.sendMessage(problem);
    const solution = result.response.text();

    return NextResponse.json({ solution }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to generate solution" }, { status: 500 });
  }
}

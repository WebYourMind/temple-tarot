// import { kv } from "@vercel/kv";
import { sql } from "@vercel/postgres";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { getSession } from "lib/auth";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Assuming you have a function to get thinking style scores
async function getThinkingStyleScores() {
  // Replace with actual logic to retrieve thinking style scores
  const scores = { analytical: 80, creative: 70, logical: 90, practical: 60 };
  return scores;
}

// Craft a description for the model
function createThinkingStyleDescription(scores: any) {
  return `The user has the following thinking style scores - Analytical: ${scores.analytical}, Creative: ${scores.creative}, Logical: ${scores.logical}, Practical: ${scores.practical}. Tailor your response style to the user's preferences based on their thinking style. Offer solutions that leverage the user's strengths within their thinking styles. Your response should be short, concise, and easily readable.`;
}

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { messages, previewToken } = json as any;
  const userId = (await getSession())?.user.id;

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (previewToken) {
    configuration.apiKey = previewToken;
  }

  //   for (const message of messages) {
  const message = messages[messages.length - 1];
  if (message.role === "user") {
    await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${message.content}, ${message.role})`;
  }
  //   }

  const scores = await getThinkingStyleScores();
  const thinkingStyleDescription = createThinkingStyleDescription(scores);

  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: thinkingStyleDescription,
        },
        message, // user's messages follow here
      ],
      temperature: 0.2,
      stream: true,
      max_tokens: 1000,
      user: userId.toString(),
    });

    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${completion}, 'assistant')`;
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("An error occurred:", error);

    // If the error object has a response property, it could be an HTTP response
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something else triggered an error
      console.error("Error message:", error.message);
    }
  }
}

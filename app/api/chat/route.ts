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
function createConextPrompt(scores: any) {
  return `The user has the following thinking style scores - Analytical: ${scores.analytical}, Creative: ${scores.creative}, Logical: ${scores.logical}, Practical: ${scores.practical}. Tailor your response style to the user's preferences based on their thinking style. Offer solutions that leverage the user's strengths within their thinking styles. Base your responses off the teachings of Mark Bonchek. Your response should be short, concise, and easily readable.`;
}

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { messages, previewToken, thinkingStyle } = json as any;
  const userId = (await getSession())?.user.id;

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  if (previewToken) {
    configuration.apiKey = previewToken;
  }

  const message = messages[messages.length - 1];
  const contextPrompt = createConextPrompt(thinkingStyle);
  console.log(contextPrompt);

  try {
    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // "gpt-4-1106-preview",
      messages: [
        {
          role: "system",
          content: contextPrompt,
        },
        message, // user's messages follow here
      ],
      temperature: 0.2,
      stream: true,
      //   max_tokens: 1000,
      user: userId.toString(),
    });
    console.log(res);

    const retryAfter = res?.headers.get("Retry-After");
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      console.log(`Retrying after ${retryAfterSeconds} seconds.`);
      // Wait for the specified number of seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
      // Consider adding logic to retry the request here
    }

    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${message.content}, ${message.role})`;
        await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${completion}, 'assistant')`;
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    // Log the error status and headers
    console.error("Error status:", error.response?.status);
    console.error("Response headers:", [...error.response?.headers.entries()]);

    // Check for 'Retry-After' header and parse it
    const retryAfter = error.response?.headers.get("Retry-After");
    if (retryAfter) {
      const retryAfterSeconds = parseInt(retryAfter, 10);
      console.log(`Retrying after ${retryAfterSeconds} seconds.`);
      // Wait for the specified number of seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
      // Consider adding logic to retry the request here
    }

    // Handle other types of errors or rethrow if not related to rate limiting
    if (!error.response || error.response.status !== 429) {
      throw error;
    }
  }
}

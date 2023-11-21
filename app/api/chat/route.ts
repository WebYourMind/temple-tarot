import { sql } from "@vercel/postgres";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { getSession } from "lib/auth";
import { Score } from "lib/quiz";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createContextPrompt({
  explorer,
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: Score) {
  const scores = { explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever };
  // Identify the dominant thinking style based on the highest score
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );
  return `Context: The user's thinking style scores are - explorer: ${scores.explorer}, analyst: ${scores.analyst}, designer: ${scores.designer}, optimizer: ${scores.optimizer}, connector: ${scores.connector}, nurturer: ${scores.nurturer}, energizer: ${scores.energizer}, achiever: ${scores.achiever}. The dominant thinking style is "${dominantStyle}".
  Tailor your response to align with the characteristics of the "${dominantStyle}" archetype.
  Adapt your language and content to resonate with the "${dominantStyle}" thinking style, offering solutions that leverage its strengths.
  Incorporate relevant examples or analogies where appropriate, drawing only upon Mark Bonchek's Shift Thinking framework and teachings or nature's systems as applicable explicitly stating so.
  Ensure your response is short, concise, and easily readable. Conclude with a thought-provoking question to engage the user further, if appropriate. Politely decline to answer if a question has no relevance to the teachings of Shift Thinking.`;
}

const basicContextPrompt =
  "Incorporate relevant examples or analogies where appropriate, drawing only upon Mark Bonchek's Shift Thinking framework and teachings or nature's systems as applicable without explicitly stating so. Ensure your response is short, concise, and easily readable. Conclude with a thought-provoking question to engage the user further, if appropriate. Politely decline to answer if a question has no relevance to the teachings of Shift Thinking.";

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { messages, scores } = json as any;
  const userId = (await getSession())?.user.id;

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", {
      status: 500,
    });
  }

  const latestMessage = messages[messages.length - 1];
  const relevantMessages = messages.slice(-4);
  const contextPrompt = scores ? createContextPrompt(scores) : basicContextPrompt;

  try {
    const res = await openai.createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content: contextPrompt,
        },
        ...relevantMessages,
      ],
      temperature: 0.2,
      stream: true,
      //   max_tokens: 1000,
      user: userId.toString(),
    });

    const stream = OpenAIStream(res, {
      async onCompletion(completion) {
        await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${latestMessage.content}, ${latestMessage.role})`;
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

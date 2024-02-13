import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { Score } from "lib/quiz";
import { NextRequest, NextResponse } from "next/server";
import config from "app.config";
import { getScoresArray, getSortedStyles, getTopTwoStyles } from "lib/utils";
import { getChatMessagesByUserId, insertPasswordResetToken } from "lib/database/chatMessages.database";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createContextPrompt({ explore, analyze, plan, optimize, connect, nurture, energize, achieve }: Score) {
  const scores = { explore, analyze, plan, optimize, connect, nurture, energize, achieve };
  // Identify the dominant thinking style based on the highest score
  const dominantStyle = getTopTwoStyles(scores)?.join(" | ");

  const sortedStyles = getSortedStyles(getScoresArray(scores));
  return config.chatbot.prompts.chatScoresContext(dominantStyle, sortedStyles);
}

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { messages, scores, userId } = json as any;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", {
      status: 500,
    });
  }

  const latestMessage = messages[messages.length - 1];
  const relevantMessages = messages.slice(-4);
  const contextPrompt = scores ? createContextPrompt(scores) : config.chatbot.prompts.chatContext;

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
        const isUserInserted = await insertPasswordResetToken(userId, latestMessage.content, latestMessage.role);
        if (!isUserInserted) {
          throw new Error("Error inserting into database");
        }
        const isAIInserted = await insertPasswordResetToken(userId, completion, "assistant");
        if (!isAIInserted) {
          throw new Error("Error inserting into database");
        }
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ error: "The user ID must be provided." }, { status: 400 });
    }

    // Query to select the latest reports row for the given user ID
    const existingMessages = await getChatMessagesByUserId(parseInt(userId));

    // Check if we got a result back
    if (!existingMessages) {
      return NextResponse.json({ error: "No chat found for the given user ID." }, { status: 404 });
    }

    // Return the latest scores row
    return NextResponse.json({ message: "Chat retrieved successfully.", existingMessages }, { status: 200 });
  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

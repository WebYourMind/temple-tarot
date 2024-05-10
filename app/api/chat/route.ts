import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { NextRequest, NextResponse } from "next/server";
import { getChatMessagesByUserId } from "lib/database/chatMessages.database";
import { chatTemplateNoStyles } from "lib/templates/chat.templates";
import { getSession } from "lib/auth";
import { Reading, addReadingWithCards } from "lib/database/readings.database";
import { CardInReading } from "lib/database/cardsInReadings.database";
import { spendCredits } from "lib/stripe-credits-utils";

export const runtime = "nodejs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { cards, userQuery, spreadType, content } = json as Reading & CardInReading & { content: string };
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user;

  try {
    // Deduct one credit
    const { newSubCredits, newAddCredits } = await spendCredits(user.id, 1);
    console.log("Credits remaining:", { newSubCredits, newAddCredits });
  } catch (error: any) {
    console.error("Error using credits:", error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", {
      status: 500,
    });
  }

  const contextPrompt = chatTemplateNoStyles;

  try {
    const openAiRes = await openai.createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content: contextPrompt,
        },
        { role: "user", content },
      ],
      temperature: 0.2,
      stream: true,
      // max_tokens: 2500,
    });

    const stream = OpenAIStream(openAiRes, {
      async onCompletion(completion) {
        // console.log(completion);
        // if (user) {
        //   await updateCreditsByEmail(user.email, -1);
        // }
        const reading = {
          userId: user.id,
          userQuery,
          spreadType,
          aiInterpretation: completion,
        };
        await addReadingWithCards(reading, cards);
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

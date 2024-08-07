import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

import { NextRequest, NextResponse } from "next/server";
import { getChatMessagesByUserId } from "lib/database/chatMessages.database";
import { getSession } from "lib/auth";
import { Reading } from "lib/database/readings.database";
import { CardInReading } from "lib/database/cardsInReadings.database";
import { rateLimitReached } from "lib/database/apiUsageLogs.database";
import { addReadingToTarotSession, TarotSession } from "lib/database/tarotSessions.database";

export const runtime = "nodejs";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function prevReadingContent(reading: Reading) {
  // console.log(reading);
  // const cardDescriptions = reading.cards
  //   .map(
  //     (card, index) =>
  //       `Position: ${index + 1}, position meaning: ${reading.spread} \nCard drawn for this position: "${
  //         card.cardName
  //       }" (${card.orientation})\n\n`
  //   )
  //   .join(", ");

  // const content = `Query: ${reading.userQuery || "Open Reading"}
  //     Chosen spread: ${reading.spread}
  //     Cards drawn with their positions in the spread: ${cardDescriptions}`;
  return `
  User query:
  ${reading.userQuery || "Open Reading"}

  AI reading interpretation:
  ${reading.aiInterpretation}
  `;
}

const interpretationInstructions = `
A reading may include a query, along with selected cards and their positions, in a tarot spread from a specified Tarot Deck.
You will respond with your interpretation of this reading based on the positions.
Ensure your interpretation is based on the specified Tarot deck.
Unless it's a single card spread, ensure that you explain the meaning and significance of each position in the spread when interpreting the cards.
Tell a story with the reading, connecting the cards and the user query to weave a meaningful narrative rich with symbolism.
`;

export const getContextPrompt = (isReading) => `
This is a tarot reading interpeter AI application for individuals seeking guidance.
You will receive a tarot reading or a follow-up query based on previous readings.
Please ensure that you reference past interactions if they can be relevant.
${isReading ? interpretationInstructions : ""}
Use emojis and make the text vivid and visual. The tone should be positive, encouraging, and empowering, providing deep insights and actionable advice.
Your response is consumer facing so ensure that it is suitable as a published content and do not use any placeholders.
Remain grounded and avoid being theatrical.
Do not list the provided data at the beginning of your response as it will already be displayed in the UI.
Now, provide an engaging response with subtle markdown formatting.
`;

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { cards, userQuery, spread, content, tarotSessionId, followUpContext } = json as Reading &
    CardInReading & { content: string; tarotSessionId?: string; followUpContext?: TarotSession };
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user;

  const isLimitReached = await rateLimitReached(user.id);
  if (isLimitReached) {
    return NextResponse.json(
      {
        error: "AI limit reached for today",
      },
      {
        status: 429,
      }
    );
  }

  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", {
      status: 500,
    });
  }

  const contextPrompt = getContextPrompt(spread && cards);

  const messages = [
    {
      role: "system",
      content: contextPrompt,
    },
  ];

  if (followUpContext) {
    followUpContext.readings.forEach((reading) => {
      messages.push({
        role: "assistant",
        content: prevReadingContent(reading),
      });
    });
  }

  messages.push({ role: "user", content });

  try {
    const openAiRes = await openai.createChatCompletion({
      model,
      // @ts-ignore
      messages,
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
          spread,
          aiInterpretation: completion,
          cards,
        };

        await addReadingToTarotSession(user.id, reading, tarotSessionId);
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

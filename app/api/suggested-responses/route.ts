import { Configuration, OpenAIApi } from "openai-edge";

import { Score } from "lib/quiz";
import { NextResponse } from "next/server";
import config from "app.config";
import { getScoresArray, getSortedStyles } from "lib/utils";

export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

function createContextPrompt({ explorer, expert, planner, optimizer, connector, coach, energizer, producer }: Score) {
  const scores = { explorer, expert, planner, optimizer, connector, coach, energizer, producer };
  // Identify the dominant thinking style based on the highest score
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  const sortedStyles = getSortedStyles(getScoresArray(scores));
  return config.chatbot.prompts.chatScoresContext(dominantStyle, sortedStyles);
}

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { lastMessage, n } = json as any;

  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", {
      status: 500,
    });
  }

  const promotToSuggestedResponse = `
  Previous user question: "${lastMessage}"
  Generate suggested questions. For user so that user can click on them and get information. 
  The Generated Questions Should Utilize the thinking styles (Explorer, Planner, Energizer, Connector, Expert, Optimizer, Producer, Coach) So that User Can easily get diverse perspectives and insights. 
 
  Note: Only give one Short Question that could be cover in 15 tokens to or in 10 words. At the start and end of the question add the following: "Q:" and "?"
  `;

  try {
    const res = await openai.createChatCompletion({
      model,
      messages: [
        {
          role: "system",
          content: promotToSuggestedResponse,
        },
      ],
      temperature: 0.8,
      max_tokens: 15,
      n: n || 4,
    });
    const data = (await res.json()) as any;
    const choices = data.choices;

    const suggestedResponses = choices.map((choice: any) => choice.message.content);

    return NextResponse.json(suggestedResponses, { status: 200 });
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

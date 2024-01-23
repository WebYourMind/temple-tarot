import { Configuration, OpenAIApi } from "openai-edge";
import { NextResponse } from "next/server";

export const runtime = "edge";

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  const json = (await req.json()) as any;
  const { lastMessage } = json as any;

  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", { status: 500 });
  }

  const promotToSuggestedResponse = `
  Context: this is an AI response to a user query.
  AI response: "${lastMessage}" 
  Generate 3 short suggested questions the user might ask in response to this AI message. Keep the subject in the topic of 'Thinking Styles'.
  Your entire response should be an array of strings in json format and easily parsable. No markdown. Example:
  ["response 1", "response 2"]
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
      temperature: 0,
    });
    const data = (await res.json()) as any;
    const choices = data.choices;
    const suggestedResponses = JSON.parse(choices[0].message.content);

    return NextResponse.json({ suggestedResponses }, { status: 200 });
  } catch (error: any) {
    console.error("Error status:", error.response?.status);
    console.error("Response headers:", [...error.response?.headers.entries()]);

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

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
  Previous AI message: "${lastMessage}" 
  Generate 3 short suggested question responses to the AI message for the user so that they can easily respond to this message. 
  Your entire response should be an array in json format.
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
      temperature: 0.2,
    });
    const data = (await res.json()) as any;
    const choices = data.choices;
    const suggestedResponses = JSON.parse(choices[0].message.content);

    return NextResponse.json(suggestedResponses, { status: 200 });
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

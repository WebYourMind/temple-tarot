import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { ThinkingStyle } from "../quiz/route";
import { sql } from "@vercel/postgres";
import { getSession } from "lib/auth";

const createReportGenerationPrompt = ({
  analytical,
  creative,
  interpersonal,
  logical,
  practical,
  reflective,
}: ThinkingStyle) => `
Generate a comprehensive insight report in markdown format for a user based on the following thinking style profile: analytical(${analytical}), creative(${creative}), interpersonal(${interpersonal}), logical(${logical}), practical(${practical}), reflective(${reflective}). Please provide personalized advice that includes:

1. Strategies for personal growth and learning that align with their thinking style.
2. Tips for decision-making and problem-solving tailored to their analytic and dynamic tendencies.
3. Recommendations for enhancing interpersonal relationships considering their pragmatic and relational scores.
4. Ideas for managing change and uncertainty in personal and professional contexts.
5. Techniques for maintaining motivation and energy based on the activities that best suit their thinking style.
6. Suggestions for career development and navigating workplace dynamics.

End the report with a short summary of key takeaways for maintaining balance and overall well-being.
`;

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { thinkingStyle } = (await req.json()) as { thinkingStyle: ThinkingStyle };

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

  const content = createReportGenerationPrompt(thinkingStyle);

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Replace with your API key
  });
  const openai = new OpenAIApi(configuration);

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model,
    stream: true,
    messages: [
      {
        role: "user",
        content,
      },
    ],
    temperature: 0.2,
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      await sql`
        INSERT INTO reports (user_id, report)
        VALUES (${userId}, ${completion})
        RETURNING *;
      `;
    },
  });

  return new StreamingTextResponse(stream);
}

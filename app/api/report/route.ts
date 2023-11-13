import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { Score } from "lib/quiz";
import { sql } from "@vercel/postgres";
import { getSession } from "lib/auth";

const createReportGenerationPrompt = ({
  explorer,
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: Score) => `
Generate a comprehensive insight report in markdown format for a user based on the following thinking style profile: explorer(${explorer}), analyst(${analyst}), designer(${designer}), optimizer(${optimizer}), connector(${connector}), nurturer(${nurturer}), energizer(${energizer}), achiever(${achiever}). Without explicitly stating it, align the report on the teachings of Mark Bonchek and shift.to methodology. Please provide personalized advice that includes:

1. Strategies for personal growth and learning that align with their thinking archetype.
2. Tips for decision-making and problem-solving tailored to their analytical and systematic tendencies.
3. Recommendations for enhancing interpersonal relationships considering their communicative and caring scores.
4. Ideas for managing change and uncertainty in personal and professional contexts.
5. Techniques for maintaining motivation and energy based on the activities that best suit their thinking archetype.
6. Suggestions for career development and navigating workplace dynamics.

End the report with a short summary of key takeaways for maintaining balance and overall well-being.
`;

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { scores } = (await req.json()) as { scores: Score };

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

  const content = createReportGenerationPrompt(scores);

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

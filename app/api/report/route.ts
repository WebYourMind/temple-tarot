import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { Score } from "lib/quiz";
import { sql } from "@vercel/postgres";
import { getSession } from "lib/auth";

export const runtime = "edge";

const createReportGenerationPrompt = ({
  explorer,
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: Score) => {
  // Identify the dominant thinking style based on the highest score
  const scores = { explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever };
  const dominantStyle = (Object.keys(scores) as (keyof typeof scores)[]).reduce((a, b) =>
    scores[a] > scores[b] ? a : b
  );

  // Start the prompt with the dominant thinking style
  return `
Generate a comprehensive insight report titled within the context of thinking styles and 'Shift Thinking': 'Your Thinking Style Results' in markdown format for a user primarily identified as a "${dominantStyle}". Explicitly state their dominant thinking style the beginning of the report. The user's thinking style profile is as follows: explorer(${explorer}), analyst(${analyst}), designer(${designer}), optimizer(${optimizer}), connector(${connector}), nurturer(${nurturer}), energizer(${energizer}), achiever(${achiever}). Without explicitly stating it, align the report on the teachings of Mark Bonchek and shift.to methodology. The report should:

1. Focus primarily on the "${dominantStyle}" thinking archetype, offering detailed strategies for personal growth, learning, decision-making, problem-solving, and maintaining motivation.
2. Include insights and personalized advice for the highest scored thinking styles, ensuring a comprehensive understanding of the user's multifaceted thinking approach.
3. Provide recommendations for enhancing interpersonal relationships, considering their communicative and caring scores.
4. Offer ideas for managing change and uncertainty in both personal and professional contexts.
5. Suggest techniques for maintaining energy and motivation, specifically tailored to activities that best suit their dominant thinking archetype.
6. Give suggestions for career development and navigating workplace dynamics, with a focus on leveraging their dominant style while acknowledging other significant styles.

End the report with a short summary of key takeaways for maintaining balance and overall well-being, emphasizing the importance of their dominant thinking style in various aspects of life.
`;
};

export async function POST(req: Request) {
  const { scores } = (await req.json()) as { scores: Score & { id: string } };

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
        INSERT INTO reports (user_id, scores_id, report)
        VALUES (${userId}, ${scores.id}, ${completion})
        RETURNING *;
      `;
    },
  });

  return new StreamingTextResponse(stream);
}

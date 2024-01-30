import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { Score } from "lib/quiz";
import { getScoresArray, getSortedStyles, getTopTwoStyles } from "lib/utils";

export const runtime = "edge";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

const createReportGenerationPrompt = ({
  explore,
  analyze,
  design,
  optimize,
  connect,
  nurture,
  energize,
  achieve,
}: Score) => {
  // Identify the dominant thinking style based on the highest score
  const scores = { explore, analyze, design, optimize, connect, nurture, energize, achieve };
  const sortedStyles = getSortedStyles(getScoresArray(scores));

  const dominantStyle = getTopTwoStyles(scores)?.join(" ");

  // Start the prompt with the dominant thinking style
  return `
  Generate a detailed insight report titled 'Your Thinking Style Results' with '${dominantStyle}' as the subheading in markdown format for a user with dominant "${dominantStyle}" thinking styles. The user's full thinking style profile is as follows: ${sortedStyles.join(
    ", "
  )}. The report should:

1. Provide a personalized profile, incorporating real-life applications and scenarios specific to the user's dominant thinking styles.
2. Include a comparative analysis between the user's higher and lower-scoring thinking styles, offering insights into how they interact and influence each other in various settings.
3. Offer strategies for developing lower-scoring thinking styles, aiming for a balanced and versatile thinking approach.
4. Deliver tailored career advice, pinpointing specific roles or industries where the ${dominantStyle} styles are especially valuable, and guiding on how to navigate these paths.
5. Present actionable strategies for leveraging ${dominantStyle} styles in decision-making, problem-solving, and maintaining motivation.
6. Discuss stress management techniques suitable for the user's thinking style profile, providing strategies for coping with pressure and uncertainty.
7. If available, include insights or testimonials from individuals with a similar thinking style profile for real-world perspective and validation.
8. Advise on long-term growth strategies that align with the user's dominant thinking styles, ensuring sustainable personal and professional development.
9. Encourage the user to engage in self-reflection, relating the insights provided in the report to their own experiences.

Conclude the report with a summary of key takeaways, emphasizing the role of the dominant thinking style in achieving a balanced and fulfilling life.

These are the full Thinking Style Definitions for reference:
    Explore: Focused on generating creative ideas and big-picture thinking.
    Design: Concerned with designing effective systems and processes.
    Energize: Aims to mobilize people into action and inspire enthusiasm.
    Connect: Builds and strengthens relationships, focusing on the interpersonal aspects.
    Analyze: Seeks to achieve objectivity and insight, often delving into the details.
    Optimize: Strives to improve productivity and efficiency, fine-tuning processes.
    Achieve: Driven to achieve completion and maintain momentum, often action-oriented.
    Nurture: Dedicated to cultivating people and potential, focusing on personal development.
`;
};

export async function POST(req: NextRequest) {
  const { scores } = (await req.json()) as { scores: Score & { id: string; user_id: string } };

  const userId = scores.user_id;

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
        ON CONFLICT (user_id) DO UPDATE
        SET scores_id = EXCLUDED.scores_id,
            report = EXCLUDED.report
        RETURNING *;
      `;
    },
  });

  return new StreamingTextResponse(stream);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    // Query to select the latest reports row for the given user ID
    const { rows: reports } = await sql`
      SELECT reports.*, scores.explore, scores.analyze, scores.design, 
            scores.optimize, scores.connect, scores.nurture, 
            scores.energize, scores.achieve
      FROM reports
      INNER JOIN scores ON reports.scores_id = scores.id
      WHERE reports.user_id = ${userId}
      ORDER BY reports.created_at DESC
      LIMIT 1;
    `;

    // Check if we got a result back
    if (reports.length === 0) {
      return NextResponse.json(
        {
          error: "No report found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    const convertedReports = reports.map((row) => ({
      ...row,
      explore: parseFloat(row.explore),
      design: parseFloat(row.design),
      energize: parseFloat(row.energize),
      connect: parseFloat(row.connect),
      analyze: parseFloat(row.analyze),
      optimize: parseFloat(row.optimize),
      achieve: parseFloat(row.achieve),
      nurture: parseFloat(row.nurture),
    }));

    // Return the latest scores row
    return NextResponse.json(
      {
        message: "Latest report retrieved successfully.",
        report: convertedReports[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Return an error response
    return NextResponse.json(
      {
        error: "An error occurred while processing your request.",
      },
      {
        status: 500,
      }
    );
  }
}

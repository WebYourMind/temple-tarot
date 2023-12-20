import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { PromptTemplate } from "langchain/prompts";
import { Configuration, OpenAIApi } from "openai-edge";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { getRelativePercentages } from "lib/utils";
import { ArchetypeValues } from "lib/types";
import { getTeamReport, insertTeamReport } from "../../../lib/database/teamReport.database";
import { teamMemberTemplate, teamReportTemplate } from "../../../lib/templates/team.templates";
import { getTeamById } from "../../../lib/database/team.database";

export const runtime = "edge";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

const getScoresUpdateMessage = (scores: string[]) => {
  return `🌟 Thinking Styles Reassessed! 🌟

Your journey of self-discovery continues with fresh insights. Here's how your thinking styles now align:

- Explorer: ${scores[0]}%
- Analyst: ${scores[1]}%
- Designer: ${scores[2]}%
- Optimizer: ${scores[3]}%
- Connector: ${scores[4]}%
- Nurturer: ${scores[5]}%
- Energizer: ${scores[6]}%
- Achiever: ${scores[7]}%

Embrace these insights and continue to explore the unique facets of your thought processes!`;
};

const createReportGenerationPrompt = ({
  explorer,
  analyst,
  designer,
  optimizer,
  connector,
  nurturer,
  energizer,
  achiever,
}: ArchetypeValues) => {
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
7. Outline the risks, pitfalls, and anything else the user should be aware of based on their thinking style scores.

End the report with a short summary of key takeaways for maintaining balance and overall well-being, emphasizing the importance of their dominant thinking style in various aspects of life.
`;
};

export async function POST(req: NextRequest) {
  const { users, team } = (await req.json()) as any;

  if (!users || !team) {
    return new Response("Invalid request body", { status: 400 });
  }
  if (!team.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const teamData = await getTeamById(team.id);

  if (!teamData) {
    return new Response("Team not found", { status: 404 });
  }

  const teamMemberTemplateList = [];
  for (let i = 0; i < users.length; i++) {
    const name = users[i].name;

    const { explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever } = users[i].scores;

    const tempPrompt = teamMemberTemplate
      .replace("{memberNumber}", name)
      .replace("{explorer}", explorer)
      .replace("{analyst}", analyst)
      .replace("{designer}", designer)
      .replace("{optimizer}", optimizer)
      .replace("{connector}", connector)
      .replace("{nurturer}", nurturer)
      .replace("{energizer}", energizer)
      .replace("{achiever}", achiever);
    teamMemberTemplateList.push(tempPrompt);
  }

  const teamReportTemplatePrompt = PromptTemplate.fromTemplate(teamReportTemplate);

  const langChainChatModel = new ChatOpenAI({ temperature: 0.8 });

  const outputParser = new BytesOutputParser();

  const chain = teamReportTemplatePrompt.pipe(langChainChatModel).pipe(outputParser);

  const chainStream = await chain.stream(
    { teamMembers: teamMemberTemplateList.join("\n") },
    {
      callbacks: [
        {
          async handleLLMEnd(output) {
            const report = output["generations"][0][0].text ?? "";
            await insertTeamReport(team.id, report);
          },
        },
      ],
    }
  );

  return new StreamingTextResponse(chainStream);
}

/*
const model = process.env.GPT_MODEL;

if (!model) {
  return new Response("No GPT model set", {
    status: 500,
  });
}

const content = createReportGenerationPrompt(scores);
const scoresUpdate = getScoresUpdateMessage(getRelativePercentages(scores as ArchetypeValues));

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
    await sql`INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${scoresUpdate}, 'assistant')`;
  },
});

return new StreamingTextResponse(stream);*/

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    // Check if teamId is not null or undefined
    if (!teamId) {
      return NextResponse.json({ error: "No team ID provided." }, { status: 400 });
    }

    // Query to select the latest reports row for the given user ID
    const teamReport = await getTeamReport(teamId);

    if (teamReport === null) {
      return NextResponse.json({ error: "No report found for the given team ID." }, { status: 404 });
    }
    const data = {
      id: teamReport.id,
      created_at: teamReport.created_at,
      report: teamReport.report,
    };
    // Return the latest team report row
    return NextResponse.json({ message: "Latest report retrieved successfully.", data: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

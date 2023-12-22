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
import { util } from "protobufjs";
import float = util.float;

export const runtime = "edge";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

const getScoresUpdateMessage = (name: string, scores: { [key: string]: number }) => {
  return `
  - Team Member ${name}: 
  
  🌟 Thinking Styles Reassessed! 🌟

    Your journey of self-discovery continues with fresh insights. Here's how your thinking styles now align:
    
    - Explorer: ${scores.explorer}%
    - Analyst: ${scores.analyst}%
    - Designer: ${scores.designer}%
    - Optimizer: ${scores.optimizer}%
    - Connector: ${scores.connector}%
    - Nurturer: ${scores.nurturer}%
    - Energizer: ${scores.energizer}%
    - Achiever: ${scores.achiever}%
    
    Embrace these insights and continue to explore the unique facets of your thought processes!`;
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
    const userTemplate = getScoresUpdateMessage(name, users[i].scores);

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

    teamMemberTemplateList.push(userTemplate);
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

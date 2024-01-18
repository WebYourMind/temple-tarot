import { NextRequest, NextResponse } from "next/server";
import { getTeamReport, insertTeamReport } from "../../../lib/database/teamReport.database";
import { teamMemberTemplate, teamReportTemplate } from "../../../lib/templates/team.templates";
import {
  checkTeamThinkingStyleScore,
  getTeamById,
  getTeamMemberByTeamId,
  getTeamScore,
} from "../../../lib/database/team.database";
import { StreamingTextResponse } from "ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { BytesOutputParser } from "@langchain/core/output_parsers";
import { getDominantStyle } from "../../../lib/utils";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { teamId } = (await req.json()) as any;

  if (!teamId) {
    return new Response("Invalid request body", { status: 400 });
  }

  const teamData = await getTeamById(teamId);

  if (!teamData) {
    return new Response("Team not found", { status: 404 });
  }

  const teamMembers = await getTeamMemberByTeamId(teamId);

  if (!teamMembers) {
    return new Response("Team members not found", { status: 404 });
  }

  const teamMemberIds = teamMembers.map((member) => member.id);

  if (teamMemberIds.length < 3) {
    return new Response("Team must have at least 3 members", { status: 400 });
  }

  const isAllMembers = await checkTeamThinkingStyleScore(teamMemberIds);

  if (!isAllMembers) {
    return new Response("At least 3 team members thinking styles are required.", { status: 400 });
  }

  const teamScore = await getTeamScore(teamId);

  if (!teamScore) {
    return new Response("Team score not found", { status: 404 });
  }

  const teamMemberTemplateList = [];
  for (let i = 0; i < teamScore.length; i++) {
    const score = {
      explorer: teamScore[i].explorer,
      analyst: teamScore[i].analyst,
      designer: teamScore[i].designer,
      optimizer: teamScore[i].optimizer,
      connector: teamScore[i].connector,
      nurturer: teamScore[i].nurturer,
      energizer: teamScore[i].energizer,
      achiever: teamScore[i].achiever,
    };

    const dominantStyle = getDominantStyle(score);
    if (dominantStyle) {
      const { explorer, analyst, designer, optimizer, connector, nurturer, energizer, achiever } = score;

      const tempPrompt = teamMemberTemplate
        .replace("{dominantStyle}", dominantStyle)
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
  }

  const teamReportTemplatePrompt = PromptTemplate.fromTemplate(teamReportTemplate);

  const langChainChatModel = new ChatOpenAI({ temperature: 0.2 });

  const outputParser = new BytesOutputParser();

  const chain = teamReportTemplatePrompt.pipe(langChainChatModel).pipe(outputParser);

  const chainStream = await chain.stream(
    { teamMembers: teamMemberTemplateList.join("\n") },
    {
      callbacks: [
        {
          async handleLLMEnd(output: any) {
            const report = output["generations"][0][0].text ?? "";
            await insertTeamReport(teamId, report);
          },
        },
      ],
    }
  );

  return new StreamingTextResponse(chainStream);
}

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

import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { NextRequest, NextResponse } from "next/server";
import { Score } from "lib/quiz";
import { createReportGenerationPrompt } from "lib/utils";
import { insertReport, reportScoreByUserId } from "../../../lib/database/reports.database";

export const runtime = "edge";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { scores } = (await req.json()) as { scores: Score & { id: string; user_id: string } };

  const userId = scores.user_id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const model = process.env.GPT_MODEL;

  if (!model) {
    return new Response("No GPT model set", { status: 500 });
  }

  const content = createReportGenerationPrompt(scores);

  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
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
      await insertReport(parseInt(userId), parseInt(scores.id), completion);
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
    const report = await reportScoreByUserId(parseInt(userId));

    // Check if we got a result back
    if (!report) {
      return NextResponse.json({ error: "No report found for the given user ID." }, { status: 404 });
    }

    const convertedReport = {
      ...report,
      explore: parseFloat(report.explore),
      plan: parseFloat(report.plan),
      energize: parseFloat(report.energize),
      connect: parseFloat(report.connect),
      analyze: parseFloat(report.analyze),
      optimize: parseFloat(report.optimize),
      achieve: parseFloat(report.achieve),
      nurture: parseFloat(report.nurture),
    };

    // Return the latest scores row
    return NextResponse.json(
      {
        message: "Latest report retrieved successfully.",
        report: convertedReport,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Return an error response
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

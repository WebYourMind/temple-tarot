import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Score } from "lib/quiz";
import { getScoresArray, getScoresUpdateMessage, getSortedStyles } from "lib/utils";
import { getScoreByUserId, insertScore } from "../../../lib/database/scores.database";
import { insertChatMessages } from "../../../lib/database/chatMessages.database";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { scores, userId } = (await request.json()) as {
      scores: Score;
      userId: string;
    };

    const inScoreInserted = await insertScore(parseInt(userId), scores);

    if (!inScoreInserted) {
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }

    const scoresUpdate = getScoresUpdateMessage(getScoresArray(scores));

    const isChatMessageInserted = await insertChatMessages(parseInt(userId), scoresUpdate, "assistant");

    if (!isChatMessageInserted) {
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }

    return NextResponse.json({ message: "Scores added successfully." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    // Query to select the latest scores row for the given user ID
    const row = await getScoreByUserId(parseInt(userId));

    // Check if we got a result back
    if (!row) {
      return NextResponse.json({ error: "No scores found for the given user ID." }, { status: 404 });
    }

    // Convert decimal string values to numbers
    const scores = {
      ...row,
      explore: parseFloat(row.explore),
      design: parseFloat(row.design),
      energize: parseFloat(row.energize),
      connect: parseFloat(row.connect),
      analyze: parseFloat(row.analyze),
      optimize: parseFloat(row.optimize),
      achieve: parseFloat(row.achieve),
      nurture: parseFloat(row.nurture),
    };

    // Return the latest scores row
    return NextResponse.json({ message: "Latest scores retrieved successfully.", scores: scores }, { status: 200 });
  } catch (error) {
    console.error(error);
    // Return an error response
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

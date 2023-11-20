import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Score } from "lib/quiz";

// Opt out of caching for all data requests in the route segment
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { scores, userId } = (await request.json()) as {
      scores: Score;
      userId: string;
    };

    await sql`INSERT INTO scores (
        user_id, 
        explorer, 
        analyst, 
        designer, 
        optimizer, 
        connector, 
        nurturer, 
        energizer, 
        achiever
        ) VALUES (
        ${userId}, 
        ${scores.explorer}, 
        ${scores.analyst}, 
        ${scores.designer}, 
        ${scores.optimizer}, 
        ${scores.connector}, 
        ${scores.nurturer}, 
        ${scores.energizer}, 
        ${scores.achiever}
    ) RETURNING *`;

    return NextResponse.json({ message: "Scores added successfully." }, { status: 201 });
  } catch (error) {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    // Query to select the latest scores row for the given user ID
    const { rows: scores } = await sql`
      SELECT * 
      FROM scores
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    // Check if we got a result back
    if (scores.length === 0) {
      return NextResponse.json(
        {
          error: "No scores found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    // Return the latest scores row
    return NextResponse.json(
      {
        message: "Latest scores retrieved successfully.",
        scores: scores[0],
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

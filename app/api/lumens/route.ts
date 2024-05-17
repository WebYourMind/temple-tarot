import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "lib/database/user.database";
import { countReadingsByUserId } from "lib/database/readings.database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json(
        {
          error: "The user ID must be provided.",
        },
        {
          status: 400,
        }
      );
    }

    const lumens = await countReadingsByUserId(userId);

    return NextResponse.json(
      {
        message: "Lumens retrieved successfully.",
        lumens,
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

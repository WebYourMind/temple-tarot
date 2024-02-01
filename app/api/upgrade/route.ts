import { NextRequest, NextResponse } from "next/server";
import { upgradeUserToAdmin } from "lib/database/user.database";

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ error: "The user ID must be provided." }, { status: 400 });
    }

    const users = await upgradeUserToAdmin(parseInt(userId));
    if (!users) {
      return NextResponse.json(
        {
          error: "Failed to upgrade user role",
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json({ message: "User succesfully upgraded to admin.", user: users }, { status: 200 });
  } catch (error) {
    console.error(error);
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

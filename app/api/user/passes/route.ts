import { getSession } from "lib/auth";
import { getUserPassExpiry } from "lib/database/user.database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = (await getSession())?.user.id;

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

    //get user data with address from database
    const user = await getUserPassExpiry(parseInt(userId));
    // Check if we got a result back
    if (!user) {
      return NextResponse.json(
        {
          error: "No user found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    const hasExpiry = user.pass_expiry !== null;

    if (!hasExpiry) return NextResponse.json({ message: "No pass found" }, { status: 404 });

    console.log(user.pass_expiry);

    return NextResponse.json(
      {
        message: "User Pass retrieved successfully.",
        passExpiry: user.pass_expiry,
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

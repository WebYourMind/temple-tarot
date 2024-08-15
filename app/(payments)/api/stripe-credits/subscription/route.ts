import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "lib/database/user.database";
import { getSession } from "lib/auth";
// import { getCustomerBalance } from "lib/stripe-credits-utils";
import { countReadingsByUserId } from "lib/database/readings.database";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

    // get user data with address from database
    const user = await getUserById(parseInt(userId));
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

    const isSubscribed = user.is_subscribed;

    return NextResponse.json(
      {
        message: "Subscription status retrieved successfully.",
        isSubscribed,
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

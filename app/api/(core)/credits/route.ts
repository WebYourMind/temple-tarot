import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "lib/database/user.database";
import { findCustomerByEmail } from "lib/stripe-credits-utils";

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

    //get user data with address from database
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

    const customer = await findCustomerByEmail(user.email);

    return NextResponse.json(
      {
        message: "Credit balance retrieved successfully.",
        credits: customer?.metadata.credit_balance,
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

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Fetch the user's subscription status and credits
    const result = await sql`
      SELECT is_subscribed, subscription_credits, additional_credits FROM users WHERE id = ${userId};
    `;

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { is_subscribed, subscription_credits, additional_credits } = result.rows[0];
    const effectiveSubscriptionCredits = is_subscribed ? subscription_credits : 0;

    return NextResponse.json(
      {
        subscriptionCredits: effectiveSubscriptionCredits,
        additionalCredits: additional_credits,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user credits:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

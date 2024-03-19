import { NextRequest, NextResponse } from "next/server";
import {
  deleteVerificationToken,
  validateVerificationToken,
} from "../../../../../lib/database/verificationTokens.database";
import { updateUserVerified } from "../../../../../lib/database/user.database";

export async function POST(request: NextRequest) {
  try {
    const { token } = (await request.json()) as { token: string };

    // Validate the token and get the associated email or user ID
    const rows = await validateVerificationToken(token);

    if (!rows) return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });

    const identifier = rows.identifier;

    // Token is valid, so update the user's email verification status
    const isUpdated = await updateUserVerified(identifier);

    if (!isUpdated)
      return NextResponse.json({ error: "An error occurred while processing your request. UV" }, { status: 500 });

    const isDeleted = await deleteVerificationToken(token);

    if (!isDeleted)
      return NextResponse.json({ error: "An error occurred while processing your request. DT" }, { status: 500 });

    return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
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

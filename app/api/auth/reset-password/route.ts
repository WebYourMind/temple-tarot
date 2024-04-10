import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { deletePasswordResetToken, getPasswordResetToken } from "../../../../lib/database/passwordResetTokens.database";
import { updateUserHashed } from "../../../../lib/database/user.database";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = (await request.json()) as { token: string; password: string };

    if (!token) return NextResponse.json({ error: "Token is Required" }, { status: 400 });

    if (!password) return NextResponse.json({ error: "Password is Required" }, { status: 400 });

    // Validate the token and get the associated email or user ID
    const rows = await getPasswordResetToken(token);

    if (!rows) return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });

    const userId = rows.user_id;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Token is valid, so update the user's password
    const isUpdated = await updateUserHashed(parseInt(userId), hashedPassword);

    if (!isUpdated)
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });

    const isDeleted = await deletePasswordResetToken(token);

    if (!isDeleted)
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });

    return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
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

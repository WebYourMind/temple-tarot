import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "lib/auth";
import { getUserById, updateUserHashed } from "../../../../lib/database/user.database";

export async function POST(request: NextRequest) {
  try {
    const userId = (await getSession())?.user.id;
    const { oldPassword, newPassword } = (await request.json()) as { oldPassword: string; newPassword: string };

    if (!userId) return NextResponse.json({ error: "UserID is Required" }, { status: 400 });

    // Validate the token and get the associated email or user ID
    const user = await getUserById(parseInt(userId));

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 400 });

    const passwordMatch = await bcrypt.compare(oldPassword, user.hashed_password);

    if (!passwordMatch) return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Token is valid, so update the user's password
    const isUpdated = await updateUserHashed(parseInt(userId), hashedPassword);

    if (!isUpdated)
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

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = (await request.json()) as { token: string; password: string };

    // Validate the token and get the associated email or user ID
    const { rows } = await sql`
      SELECT * FROM password_reset_tokens WHERE token = ${token}
    `;

    if (rows.length > 0) {
      const userId = rows[0].user_id;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Token is valid, so update the user's password
      await sql`
        UPDATE users SET hashed_password = ${hashedPassword} WHERE id = ${userId}
      `;

      await sql`
        DELETE FROM password_reset_tokens WHERE token = ${token}
      `;

      return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
    }
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

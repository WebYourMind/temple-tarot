import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { getSession } from "lib/auth";

export async function POST(request: NextRequest) {
  try {
    const userId = (await getSession())?.user.id;
    const { oldPassword, newPassword } = (await request.json()) as { oldPassword: string; newPassword: string };

    // Validate the token and get the associated email or user ID
    const { rows } = await sql`
      SELECT * FROM users WHERE id = ${userId}
    `;
    if (rows.length > 0) {
      const user = rows[0];

      const passwordMatch = await bcrypt.compare(oldPassword, user.hashed_password);

      if (passwordMatch) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Token is valid, so update the user's password
        await sql`
        UPDATE users SET hashed_password = ${hashedPassword} WHERE id = ${userId}
      `;

        return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
      } else {
        return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
      }
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

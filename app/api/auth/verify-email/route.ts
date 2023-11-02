import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(request: NextRequest) {
  const { token } = (await request.json()) as { token: string };

  // Validate the token and get the associated email or user ID
  const { rows } = await sql`
    SELECT * FROM verification_tokens WHERE token = ${token}
  `;

  if (rows.length > 0) {
    // Token is valid, so update the user's email verification status
    await sql`
      UPDATE users SET email_verified = NOW() WHERE email = ${rows[0].identifier}
    `;

    // Optionally, delete the verification token
    await sql`
      DELETE FROM verification_tokens WHERE token = ${token}
    `;

    return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Invalid or expired verification token." }, { status: 400 });
  }
}

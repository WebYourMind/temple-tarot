import { sql } from "@vercel/postgres";
import { getSession } from "lib/auth";
import { generateReferralCode } from "lib/database/referrals.database";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const code = await generateReferralCode(userId);
    // Optionally, send the code via email or return it in the response
    return NextResponse.json(
      {
        message: "Lumens retrieved successfully.",
        code,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET(req, res) {
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { rows } = await sql`
      SELECT * FROM referral_codes WHERE user_id = ${userId}
    `;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

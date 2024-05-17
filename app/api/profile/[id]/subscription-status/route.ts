import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const { rows } = await sql`
      SELECT is_subscribed FROM users WHERE id = ${id}
    `;
    return NextResponse.json({ isSubscribed: rows[0]?.is_subscribed || false });
  } catch (error) {
    console.error("Error retrieving subscription status:", error);
    return NextResponse.json({ error: "Error retrieving subscription status" }, { status: 500 });
  }
}

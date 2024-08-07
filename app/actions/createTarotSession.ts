// app/actions/createTarotSession.ts

"use server";

import { sql } from "@vercel/postgres";
import { getSession } from "lib/auth";

export async function createTarotSession() {
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const { rows } = await sql`
    INSERT INTO tarot_sessions (user_id)
    VALUES (${userId})
    RETURNING id;
  `;

  return rows[0].id;
}

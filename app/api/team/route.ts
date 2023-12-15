import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { Team, TeamForm } from "lib/types";

function sanitizeTeamData(team: any) {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    inviteToken: team.invite_token,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { team, userId } = (await request.json()) as {
      team: TeamForm;
      userId: string;
    };

    if (!team.name || !team.description || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");
    const expiryDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
    const inviteTokenExpiry = new Date(Date.now() + expiryDuration).toISOString();

    // Begin transaction
    await sql`BEGIN`;

    const { rows: teams } = await sql`INSERT INTO teams (
        admin_id,
        name,
        description,
        invite_token,
        invite_token_expiry
    ) VALUES (
        ${userId}, 
        ${team.name}, 
        ${team.description},
        ${inviteToken}, 
        ${inviteTokenExpiry}
    ) RETURNING *`;

    await sql`UPDATE users SET team_id = ${teams[0].id} WHERE id = ${userId}`;

    // Commit transaction
    await sql`COMMIT`;

    return NextResponse.json({ message: "Team created successfully.", team: teams[0] }, { status: 201 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Rollback transaction in case of error
    await sql`ROLLBACK`;

    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Check if userId is not null or undefined
    if (!userId) {
      throw new Error("The user ID must be provided.");
    }

    // select team associated with user
    const { rows: teams } = await sql`
      SELECT teams.* 
      FROM teams
      JOIN users ON users.team_id = teams.id
      WHERE users.id = ${userId}
      ORDER BY teams.created_at DESC
      LIMIT 1;
    `;

    // Check if we got a result back
    if (teams.length === 0) {
      return NextResponse.json(
        {
          error: "No teams found for the given user ID.",
        },
        {
          status: 404,
        }
      );
    }

    // Return the team row
    return NextResponse.json(
      {
        message: "Team retrieved successfully.",
        team: sanitizeTeamData(teams[0] as Team),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    // Return an error response
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

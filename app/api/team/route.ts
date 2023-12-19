import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { Team, TeamForm } from "lib/types";
import { getTeamById, getTeamScore } from "../../../lib/database/team.database";

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
    const teamId = searchParams.get("teamId");

    // Check if userId is not null or undefined
    if (!teamId) {
      return NextResponse.json(
        {
          error: "The team ID must be provided.",
        },
        {
          status: 400,
        }
      );
    }

    const team = await getTeamById(parseInt(teamId));
    // select team associated with user
    const rows = await getTeamScore(parseInt(teamId));

    // Check if we got a result back
    if (team === null) {
      return NextResponse.json(
        {
          error: "No teams found for the given team ID.",
        },
        {
          status: 404,
        }
      );
    }
    const score = [];
    const user = [];

    if (rows !== null) {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        score.push({
          id: row.score_id,
          explorer: row.explorer,
          analyst: row.analyst,
          designer: row.designer,
          optimizer: row.optimizer,
          connector: row.connector,
          nurturer: row.nurturer,
          energizer: row.energizer,
          achiever: row.achiever,
        });
        user.push({
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          phone: row.user_phone,
          role: row.user_role,
          score: score[i],
        });
      }
    }

    const teamData = {
      id: team.id,
      name: team.name,
      description: team.description,
      adminId: team.admin_id,
      image: team.image,
      user: user,
    };

    // Return the team row
    return NextResponse.json(
      {
        message: "Team retrieved successfully.",
        team: teamData,
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

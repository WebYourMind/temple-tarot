import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { TeamForm } from "lib/types";
import {
  deleteTeamById,
  getTeamById,
  getTeamByUser,
  getTeamScore,
  updateTeamByAdminID,
} from "../../../lib/database/team.database";
import { sanitizeTeamData } from "lib/utils";

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

    const rows = await getTeamScore(parseInt(teams[0].id));

    const teamData = sanitizeTeamData(rows, teams[0]);

    return NextResponse.json({ message: "Team created successfully.", team: teamData }, { status: 201 });
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
      return NextResponse.json(
        {
          error: "The user ID must be provided.",
        },
        {
          status: 400,
        }
      );
    }

    const team = await getTeamByUser(parseInt(userId));
    // select team associated with user

    // Check if we got a result back
    if (team === null) {
      return NextResponse.json({ error: "No teams found for the given user ID." }, { status: 404 });
    }

    const rows = await getTeamScore(parseInt(team.id));
    const teamData = sanitizeTeamData(rows, team);

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

export async function PATCH(request: NextRequest) {
  try {
    const { adminId, team } = (await request.json()) as any;

    if (!adminId || !team) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const isUpdated = await updateTeamByAdminID(team, parseInt(adminId));

    if (isUpdated === null || !isUpdated) {
      return NextResponse.json({ error: "Not able to update team" }, { status: 500 });
    }

    return NextResponse.json({ message: "Team Updated successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { adminId, teamId } = (await request.json()) as any;

    if (!adminId || !teamId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const team = await getTeamById(parseInt(teamId));

    if (team === null) {
      return NextResponse.json(
        {
          error: "No teams found for the given team ID.",
        },
        {
          status: 400,
        }
      );
    }

    if (team.admin_id !== parseInt(adminId)) {
      return NextResponse.json({ error: "You are not authorized to delete this team." }, { status: 403 });
    }

    const isDeleted = await deleteTeamById(parseInt(teamId));

    if (isDeleted === null || !isDeleted) {
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }

    return NextResponse.json({ message: "Team deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

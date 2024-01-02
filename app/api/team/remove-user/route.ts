import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getTeamById } from "../../../../lib/database/team.database";
import { getUserById, updateUserTeam } from "../../../../lib/database/user.database";

export async function PATCH(request: NextRequest) {
  try {
    const { adminId, userId, teamId } = (await request.json()) as any;

    if (!adminId || !teamId || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const team = await getTeamById(parseInt(teamId));

    if (team === null) {
      return NextResponse.json({ error: "No teams found for the given team ID." }, { status: 400 });
    }

    if (team.admin_id !== parseInt(adminId)) {
      return NextResponse.json({ error: "You are not authorized to delete this team." }, { status: 403 });
    }

    const user = await getUserById(parseInt(userId));

    if (user === null) {
      return NextResponse.json({ error: "No user found for the given user id" }, { status: 400 });
    }

    if (team.id !== user.team_id) {
      return NextResponse.json({ error: "You are not authorized to delete this user." }, { status: 403 });
    }
    const isUpdated = await updateUserTeam(parseInt(userId), null);

    if (isUpdated === null || !isUpdated) {
      return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User removed from team successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Rollback transaction in case of error
    await sql`ROLLBACK`;

    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}

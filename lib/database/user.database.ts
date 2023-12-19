import { sql } from "@vercel/postgres";

export const updateUserTeam = async (userId: number, teamId: number) => {
  try {
    const { rows } = await sql`
        UPDATE users SET team_id = ${teamId} WHERE id = ${userId}
      `;
    return rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

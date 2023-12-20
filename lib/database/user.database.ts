import { sql } from "@vercel/postgres";

export const updateUserTeam = async (userId: number, teamId: number | null) => {
  try {
    const result = await sql`
        UPDATE users SET team_id = ${teamId} WHERE id = ${userId}
      `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const { rows } = await sql`
            SELECT * FROM users WHERE id = ${userId}
        `;

    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

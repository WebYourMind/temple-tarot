import { sql } from "@vercel/postgres";

export const getTeamReport = async (teamId: string) => {
  try {
    const { rows } = await sql`
        SELECT * FROM team_reports
        WHERE team_id = ${teamId}
        ORDER BY created_at DESC;
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

export const insertTeamReport = async (teamId: string, report: string) => {
  try {
    const { rows } = await sql`
        INSERT INTO team_reports (team_id, report)
        VALUES (${teamId}, ${report})
        ON CONFLICT (team_id) DO UPDATE
        SET report = EXCLUDED.report
        RETURNING *;
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

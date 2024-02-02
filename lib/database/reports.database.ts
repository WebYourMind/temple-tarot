import { sql } from "@vercel/postgres";

export const insertReport = async (userId: number, scoreId: number, report: string) => {
  try {
    const { rows } = await sql`
            INSERT INTO reports (user_id, scores_id, report)
            VALUES (${userId}, ${scoreId}, ${report})
            ON CONFLICT (user_id) DO UPDATE
                SET scores_id = EXCLUDED.scores_id,
                    report    = EXCLUDED.report
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

export const reportScoreByUserId = async (userId: number) => {
  try {
    const { rows } = await sql`
            SELECT reports.*,
                   scores.explore,
                   scores.analyze,
                   scores.design,
                   scores.optimize,
                   scores.connect,
                   scores.nurture,
                   scores.energize,
                   scores.achieve
            FROM reports
                     INNER JOIN scores ON reports.scores_id = scores.id
            WHERE reports.user_id = ${userId}
            ORDER BY reports.created_at DESC
            LIMIT 1;
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

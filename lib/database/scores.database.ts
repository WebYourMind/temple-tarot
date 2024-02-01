import { sql } from "@vercel/postgres";
import { Score } from "../quiz";

export const insertScore = async (userId: number, scores: Score) => {
  try {
    const result = await sql`
            INSERT INTO scores (user_id,
                                explore,
                                "analyze",
                                design,
                                optimize,
                                "connect",
                                nurture,
                                energize,
                                achieve)
            VALUES (${userId},
                    ${scores.explore},
                    ${scores.analyze},
                    ${scores.design},
                    ${scores.optimize},
                    ${scores.connect},
                    ${scores.nurture},
                    ${scores.energize},
                    ${scores.achieve})
        `;

    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getScoreByUserId = async (userId: number) => {
  try {
    const { rows } = await sql`
            SELECT *
            FROM scores
            WHERE user_id = ${userId}
            ORDER BY created_at DESC
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

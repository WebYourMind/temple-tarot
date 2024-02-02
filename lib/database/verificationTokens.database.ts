import { sql } from "@vercel/postgres";
import { getExpireDate } from "../utils";

export const validateVerificationToken = async (token: string) => {
  try {
    const { rows } = await sql`
      SELECT *
      FROM verification_tokens
      WHERE token = ${token}
        `;

    if (rows.length > 0) return rows[0];

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteVerificationToken = async (token: string) => {
  try {
    const result = await sql`
          DELETE FROM verification_tokens WHERE token = ${token}
        `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const insertVerificationToken = async (email: string, verifyToken: string) => {
  try {
    const expirationTime = getExpireDate("ONE_WEEK").toISOString(); // one week

    const result = await sql`
      INSERT INTO verification_tokens (identifier, token, expires) VALUES (${email}, ${verifyToken}, ${expirationTime})
        `;

    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

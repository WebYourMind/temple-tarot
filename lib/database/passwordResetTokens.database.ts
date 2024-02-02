import { sql } from "@vercel/postgres";
import { getExpireDate } from "../utils";

export const getPasswordResetToken = async (token: string) => {
  try {
    const { rows } = await sql`
      SELECT * FROM password_reset_tokens WHERE token = ${token}
        `;
    if (rows.length > 0) return rows[0];
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deletePasswordResetToken = async (token: string) => {
  try {
    const result = await sql`
      DELETE FROM password_reset_tokens WHERE token = ${token}
        `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const insertPasswordResetToken = async (userId: number, resetToken: string) => {
  try {
    const expirationTime = getExpireDate("ONE_HOUR").toISOString(); // one hour
    const result = await sql`
        INSERT INTO password_reset_tokens (user_id, token, expires)
        VALUES (${userId}, ${resetToken}, ${expirationTime})`;

    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

import { sql } from "@vercel/postgres";

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

import { sql } from "@vercel/postgres";

export const InsertUser = async (name: string, email: string, hashedPassword: string) => {
  try {
    const { rows } = await sql`INSERT INTO users (email, hashed_password, name)
                      VALUES (${email}, ${hashedPassword}, ${name})
                      RETURNING *`;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserTeam = async (userId: number, teamId: number | null) => {
  try {
    const rows = await sql`
            UPDATE users
            SET team_id = ${teamId}
            WHERE id = ${userId}
        `;

    return rows.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getUserById = async (userId: number) => {
  try {
    const { rows } = await sql`
            SELECT *
            FROM users
            WHERE id = ${userId}
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

export const getUserByEmail = async (email: string) => {
  try {
    const { rows } = await sql`
            SELECT *
            FROM users
            WHERE id = ${email}
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

export const updateUserHashed = async (userId: number, hashedPassword: string) => {
  try {
    const result = await sql`
            UPDATE users
            SET hashed_password = ${hashedPassword}
            WHERE id = ${userId}
        `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserVerified = async (identifier: number) => {
  try {
    const result = await sql`
            UPDATE users
            SET email_verified = NOW()
            WHERE email = ${identifier}
        `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

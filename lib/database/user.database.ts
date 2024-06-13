import { sql } from "@vercel/postgres";

export const insertUser = async (name: string, email: string, hashedPassword?: string) => {
  try {
    const { rows } = await sql`INSERT INTO users (name, email, hashed_password)
                      VALUES (${name}, ${email}, ${hashedPassword})
                      RETURNING *`;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error("Failed to insert user:", error);
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

export const getUserById = async (userId: number | string) => {
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

export const getUserIdByEmail = async (email: string) => {
  try {
    const { rows } = await sql`
            SELECT id
            FROM users
            WHERE email = ${email}
        `;

    if (rows.length > 0) {
      const { id } = rows[0];
      return id;
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
            WHERE email = ${email}
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

export const getAddressById = async (userId: number) => {
  try {
    const { rows: existingAddress } = await sql`SELECT address_id FROM users WHERE id = ${userId}`;
    return existingAddress[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateUserAddressById = async (newAddressId: number, userId: number) => {
  try {
    await sql`UPDATE users SET address_id = ${newAddressId} WHERE id = ${userId}`;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const removeUserAddressId = async (userId: number) => {
  try {
    await sql`UPDATE users SET address_id = NULL WHERE id = ${userId}`;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUserById = async (email: string, name: string, phone: string | undefined, userId: number) => {
  try {
    const { rows } =
      await sql`UPDATE users SET email = ${email}, name = ${name}, phone = ${phone} WHERE id = ${userId} RETURNING *`;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getUserWithAdressById = async (userId: number) => {
  try {
    const { rows } = await sql`
    SELECT users.*, 
           addresses.street, 
           addresses.city, 
           addresses.state, 
           addresses.postal_code, 
           addresses.country 
    FROM users 
    LEFT JOIN addresses ON users.address_id = addresses.id
    WHERE users.id = ${userId}
  `;

    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const upgradeUserToAdmin = async (userId: number) => {
  try {
    const { rows } = await sql`UPDATE users SET role = 'admin' WHERE id = ${userId} RETURNING *`;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addStripeCustomerId = async (email, customerId) => {
  try {
    await sql`UPDATE users
      SET stripe_customer_id = ${customerId}
      WHERE email = ${email};`;
  } catch (error) {
    console.error(error);
  }
};

export const getUserAccessPlan = async (userId) => {
  try {
    const { rows } = await sql`SELECT pass_expiry, is_subscribed
      FROM users
      WHERE id = ${userId};`;
    if (rows.length > 0) {
      return rows[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

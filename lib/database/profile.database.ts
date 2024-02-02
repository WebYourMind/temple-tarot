import { sql } from "@vercel/postgres";

export const deleteProfileById = async (userId: number) => {
  try {
    // Start a transaction
    await sql`BEGIN`;

    // Deleting dependent data
    await sql`DELETE FROM chat_messages WHERE user_id = ${userId}`;
    await sql`DELETE FROM password_reset_tokens WHERE user_id = ${userId}`;
    await sql`DELETE FROM verification_tokens WHERE identifier = (SELECT email FROM users WHERE id = ${userId})`;
    await sql`DELETE FROM accounts WHERE user_id = ${userId}`;
    await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
    await sql`DELETE FROM reports WHERE user_id = ${userId}`;
    await sql`DELETE FROM scores WHERE user_id = ${userId}`;
    await sql`DELETE FROM addresses WHERE id = (SELECT address_id FROM users WHERE id = ${userId})`;

    // Finally, delete the user
    await sql`DELETE FROM users WHERE id = ${userId}`;

    // Commit the transaction
    await sql`COMMIT`;
    return true;
  } catch (error) {
    console.log(error);
  }
};

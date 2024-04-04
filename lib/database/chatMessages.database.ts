import { sql } from "@vercel/postgres";

export const insertChatMessage = async (userId: number, content: string, role: string) => {
  try {
    const result = await sql`
            INSERT INTO chat_messages (user_id, content, role) VALUES (${userId}, ${content}, ${role})`;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getChatMessagesByUserId = async (userId: number) => {
  try {
    const { rows } = await sql`
        SELECT *
        FROM chat_messages
        WHERE user_id = ${userId}
        ORDER BY created_at ASC;
    `;

    if (rows.length >= 0) {
      return rows;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const insertChatMessages = async (userId: number, content: string, role: string) => {
  try {
    const result = await sql`
      INSERT INTO chat_messages (user_id, content, role) VALUES (${userId},${content}, ${role});
    `;
    return result.rowCount > 0;
  } catch (error) {
    console.error(error);
    return null;
  }
};

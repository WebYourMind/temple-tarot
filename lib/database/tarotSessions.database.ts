import { QueryResult, sql } from "@vercel/postgres";
import { CardInReading } from "./cardsInReadings.database";
import { Reading } from "./readings.database";

// Interface for a TarotSession
export interface TarotSession {
  id?: string;
  userId: string;
  userQuery: string;
  createdAt?: Date;
  markdownPreview?: string;
  readings?: Reading[];
}

// Function to add a new tarot session with readings
export const addTarotSessionWithReadings = async (tarotSession: TarotSession, readings: Reading[]): Promise<void> => {
  try {
    await sql`BEGIN`;

    const { rows: sessionRows } = await sql`
      INSERT INTO tarot_sessions (user_id, user_query, markdown_preview)
      VALUES (${tarotSession.userId}, ${tarotSession.userQuery}, ${tarotSession.markdownPreview})
      RETURNING id;
    `;
    const tarotSessionId = sessionRows[0].id;

    for (const reading of readings) {
      const { rows: readingRows } = await sql`
        INSERT INTO readings (tarot_session_id, user_id, user_query, spread_type, ai_interpretation)
        VALUES (${tarotSessionId}, ${reading.userId}, ${reading.userQuery}, ${reading.spreadType}, ${reading.aiInterpretation})
        RETURNING id;
      `;
      const readingId = readingRows[0].id;

      for (const card of reading.cards) {
        await sql`
          INSERT INTO cards_in_readings (reading_id, card_name, orientation, position)
          VALUES (${readingId}, ${card.cardName}, ${card.orientation}, ${card.position});
        `;
      }
    }

    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("Transaction failed:", error);
    throw error;
  }
};

// Function to add a new tarot session
export const addTarotSession = async (tarotSession: TarotSession): Promise<TarotSession> => {
  try {
    const { rows } = await sql`
      INSERT INTO tarot_sessions (user_id, user_query, markdown_preview, created_at)
      VALUES (${tarotSession.userId}, ${tarotSession.userQuery}, ${tarotSession.markdownPreview}, NOW())
      RETURNING *;
    `;
    return rows[0] as TarotSession;
  } catch (error) {
    console.error("Failed to add tarot session:", error);
    throw error;
  }
};

// Function to retrieve a tarot session by ID
export const getTarotSessionById = async (id: number): Promise<TarotSession | null> => {
  try {
    const { rows } = await sql`
      SELECT * FROM tarot_sessions WHERE id = ${id};
    `;
    return (rows[0] as TarotSession) || null;
  } catch (error) {
    console.error("Failed to get tarot session:", error);
    throw error;
  }
};

// Function to list tarot sessions for a specific user
export const getTarotSessionsByUserId = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<TarotSession[]> => {
  const offset = (page - 1) * limit;

  try {
    const { rows: sessionRows } = await sql`
      SELECT id, user_id, user_query, created_at, markdown_preview
      FROM tarot_sessions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (sessionRows.length === 0) {
      return [];
    }

    const sessionIds = sessionRows.map((s) => s.id);

    const sessionsMap = new Map(
      sessionRows.map((s) => [
        s.id,
        {
          ...s,
          readings: [],
        },
      ])
    );

    for (let sessionId of sessionIds) {
      const { rows: readingRows } = await sql`
        SELECT id, tarot_session_id, user_id, user_query, spread_type, created_at, ai_interpretation
        FROM readings
        WHERE tarot_session_id = ${sessionId}
        ORDER BY created_at DESC;
      `;

      const readingIds = readingRows.map((r) => r.id);

      const readingsMap = new Map(
        readingRows.map((r) => [
          r.id,
          {
            ...r,
            cards: [],
          },
        ])
      );

      for (let readingId of readingIds) {
        const { rows: cardRows } = await sql`
          SELECT id, reading_id, card_name, orientation, position
          FROM cards_in_readings
          WHERE reading_id = ${readingId}
          ORDER BY position ASC;
        `;

        cardRows.forEach((card) => {
          if (readingsMap.has(card.reading_id)) {
            readingsMap.get(card.reading_id).cards.push({
              id: card.id,
              cardName: card.card_name,
              orientation: card.orientation,
              position: card.position,
            });
          }
        });
      }

      const readings = Array.from(readingsMap.values()) as Reading[];
      sessionsMap.get(sessionId).readings = readings;
    }

    return Array.from(sessionsMap.values()) as TarotSession[];
  } catch (error) {
    console.error("Failed to retrieve tarot sessions:", error);
    throw error;
  }
};

// Function to count all tarot sessions for a specific user
export const countTarotSessionsByUserId = async (userId: string): Promise<number> => {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) AS total FROM tarot_sessions WHERE user_id = ${userId};
    `;
    return parseInt(rows[0].total, 10);
  } catch (error) {
    console.error("Failed to count tarot sessions:", error);
    throw error;
  }
};

// Delete a tarot session
export const deleteTarotSession = async (id: string): Promise<QueryResult> => {
  try {
    return await sql`
      DELETE FROM tarot_sessions WHERE id = ${id};
    `;
  } catch (error) {
    console.error("Failed to delete tarot session:", error);
    throw error;
  }
};

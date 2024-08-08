import { QueryResult, sql } from "@vercel/postgres";
import { Reading } from "./readings.database";

export interface TarotSession {
  id: string;
  userId: string;
  createdAt: Date;
  readings: Reading[];
}

// Function to add a new tarot session with readings or add a reading to an existing tarot session
export const addReadingToTarotSession = async (
  userId: string,
  reading: Reading,
  tarotSessionId?: string
): Promise<void> => {
  try {
    await sql`BEGIN`;
    console.log("db.ts", tarotSessionId);
    if (!tarotSessionId) {
      const { rows: sessionRows } = await sql`
      INSERT INTO tarot_sessions (user_id)
      VALUES (${userId})
      RETURNING id;
    `;
      tarotSessionId = sessionRows[0].id;
    }

    if (!reading.spread || !reading.cards) {
      await sql`
        INSERT INTO readings (tarot_session_id, user_id, user_query, ai_interpretation)
        VALUES (${tarotSessionId}, ${reading.userId}, ${reading.userQuery}, ${reading.aiInterpretation});
      `;
    } else {
      const { rows: readingRows } = await sql`
        INSERT INTO readings (tarot_session_id, user_id, user_query, spread_type, ai_interpretation)
        VALUES (${tarotSessionId}, ${reading.userId}, ${reading.userQuery}, ${reading.spread.value}, ${reading.aiInterpretation})
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
      INSERT INTO tarot_sessions (user_id, created_at)
      VALUES (${tarotSession.userId}, NOW())
      RETURNING *;
    `;
    return rows[0] as TarotSession;
  } catch (error) {
    console.error("Failed to add tarot session:", error);
    throw error;
  }
};

// Function to retrieve a tarot session by ID
export const getTarotSessionById = async (id: string): Promise<TarotSession | null> => {
  try {
    // Fetch session, readings, and cards in a single query with multiple joins
    const { rows } = await sql`
      SELECT 
        ts.id AS session_id, ts.user_id AS session_user_id, ts.created_at AS session_created_at,
        r.id AS reading_id, r.user_query, r.spread_type, r.ai_interpretation, r.created_at AS reading_created_at,
        c.id AS card_id, c.card_name, c.orientation, c.position
      FROM tarot_sessions ts
      LEFT JOIN readings r ON ts.id = r.tarot_session_id
      LEFT JOIN cards_in_readings c ON r.id = c.reading_id
      WHERE ts.id = ${id}
      ORDER BY r.created_at ASC, c.position ASC;
    `;

    if (rows.length === 0) {
      return null;
    }

    // Initialize maps to hold session and readings
    const sessionsMap = new Map<number, TarotSession>();
    const readingsMap = new Map<number, Reading>();

    // Populate session and readings
    rows.forEach((row) => {
      // Initialize session if not already in the map
      if (!sessionsMap.has(row.session_id)) {
        sessionsMap.set(row.session_id, {
          id: row.session_id,
          userId: row.session_user_id,
          createdAt: row.session_created_at,
          readings: [],
        });
      }

      // Initialize reading if not already in the map
      if (row.reading_id && !readingsMap.has(row.reading_id)) {
        const newReading = {
          id: row.reading_id,
          userId: row.session_user_id,
          userQuery: row.user_query,
          spreadType: row.spread_type,
          aiInterpretation: row.ai_interpretation,
          createdAt: row.reading_created_at,
          cards: [],
        };

        readingsMap.set(row.reading_id, newReading);
        sessionsMap.get(row.session_id)?.readings.push(newReading);
      }

      // Add card to the corresponding reading
      if (row.card_id) {
        readingsMap.get(row.reading_id)?.cards.push({
          id: row.card_id,
          cardName: row.card_name,
          orientation: row.orientation,
          position: row.position,
        });
      }
    });

    return Array.from(sessionsMap.values())[0] || null;
  } catch (error) {
    console.error("Failed to get tarot session:", error);
    throw error;
  }
};

// Function to get tarot sessions by user ID with pagination
export const getTarotSessionsByUserId = async (
  userId: number,
  page: number = 1,
  limit: number = 10
): Promise<TarotSession[]> => {
  const offset = (page - 1) * limit;

  try {
    // Fetch sessions, readings, and cards in a single query with multiple joins
    const { rows: sessionData } = await sql`
      SELECT 
        ts.id AS session_id, ts.user_id AS session_user_id, ts.created_at AS session_created_at,
        r.id AS reading_id, r.user_query, r.spread_type, r.ai_interpretation, r.created_at AS reading_created_at,
        c.id AS card_id, c.card_name, c.orientation, c.position
      FROM tarot_sessions ts
      LEFT JOIN readings r ON ts.id = r.tarot_session_id
      LEFT JOIN cards_in_readings c ON r.id = c.reading_id
      WHERE ts.user_id = ${userId}
      ORDER BY ts.created_at DESC, r.created_at DESC, c.position ASC
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (sessionData.length === 0) {
      return [];
    }

    // Initialize maps to hold sessions and their readings
    const sessionsMap = new Map<number, TarotSession>();
    const readingsMap = new Map<number, Reading>();

    // Populate sessions and readings
    sessionData.forEach((row) => {
      // Initialize session if not already in the map
      if (!sessionsMap.has(row.session_id)) {
        sessionsMap.set(row.session_id, {
          id: row.session_id,
          userId: row.session_user_id,
          createdAt: row.session_created_at,
          readings: [],
        });
      }

      // Initialize reading if not already in the map
      if (row.reading_id && !readingsMap.has(row.reading_id)) {
        const newReading = {
          id: row.reading_id,
          userId: row.session_user_id,
          userQuery: row.user_query,
          spreadType: row.spread_type,
          aiInterpretation: row.ai_interpretation,
          createdAt: row.reading_created_at,
          cards: [],
        };

        readingsMap.set(row.reading_id, newReading);
        sessionsMap.get(row.session_id)?.readings.push(newReading);
      }

      // Add card to the corresponding reading
      if (row.card_id) {
        readingsMap.get(row.reading_id)?.cards.push({
          id: row.card_id,
          cardName: row.card_name,
          orientation: row.orientation,
          position: row.position,
        });
      }
    });

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

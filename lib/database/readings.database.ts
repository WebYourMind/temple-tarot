import { QueryResult, sql } from "@vercel/postgres";
import { CardInReading } from "./cardsInReadings.database";

// Interface for a Reading
export interface Reading {
  id?: string;
  userId: string;
  userQuery: string;
  spreadType:
    | "single_card"
    | "three_card"
    | "celtic_cross"
    | "love"
    | "career"
    | "daily"
    | "year_ahead"
    | "birthday"
    | "spiritual_guidance";
  aiInterpretation?: string;
  createdAt?: Date;
  cards?: CardInReading[];
}

// Function to add reading and cards
export const addReadingWithCards = async (reading: Reading, cards: CardInReading[]): Promise<void> => {
  try {
    // Start a transaction
    await sql`BEGIN`;

    // Insert the reading with AI interpretation and retrieve the new ID
    const { rows: readingRows } = await sql`
            INSERT INTO readings (user_id, user_query, spread_type, ai_interpretation)
            VALUES (${reading.userId}, ${reading.userQuery}, ${reading.spreadType}, ${reading.aiInterpretation})
            RETURNING id;
        `;
    const readingId = readingRows[0].id;

    // Insert each card associated with the reading
    for (const card of cards) {
      await sql`
                INSERT INTO cards_in_readings (reading_id, card_name, orientation, position)
                VALUES (${readingId}, ${card.cardName}, ${card.orientation}, ${card.position});
            `;
    }

    // Commit the transaction
    await sql`COMMIT`;
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`;
    console.error("Transaction failed:", error);
    throw error;
  }
};

// Function to add a new reading
export const addReading = async (reading: Reading): Promise<Reading> => {
  try {
    const { rows } = await sql`
            INSERT INTO readings (user_id, user_query, spread_type, ai_interpretation, created_at)
            VALUES (${reading.userId}, ${reading.userQuery}, ${reading.spreadType}, ${reading.aiInterpretation}, NOW())
            RETURNING *;
        `;
    return rows[0] as Reading;
  } catch (error) {
    console.error("Failed to add reading:", error);
    throw error;
  }
};

// Function to retrieve a reading by ID
export const getReadingById = async (id: number): Promise<Reading | null> => {
  try {
    const { rows } = await sql`
            SELECT * FROM readings WHERE id = ${id};
        `;
    return (rows[0] as Reading) || null;
  } catch (error) {
    console.error("Failed to get reading:", error);
    throw error;
  }
};

// Function to list readings for a specific user
export const getReadingsByUserId = async (userId: number, page: number = 1, limit: number = 10): Promise<Reading[]> => {
  const offset = (page - 1) * limit;

  try {
    // Fetch the readings first
    const { rows: readingRows } = await sql`
      SELECT id, user_id, user_query, spread_type, created_at, ai_interpretation
      FROM readings
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (readingRows.length === 0) {
      return [];
    }

    // Collect all reading IDs for the next query to fetch cards
    const readingIds = readingRows.map((r) => r.id);

    // Initialize an empty map to hold readings and their cards
    const readingsMap = new Map(
      readingRows.map((r) => [
        r.id,
        {
          ...r,
          cards: [],
        },
      ])
    );

    // Fetch cards for all fetched readings in separate queries
    for (let readingId of readingIds) {
      const { rows: cardRows } = await sql`
        SELECT id, reading_id, card_name, orientation, position
        FROM cards_in_readings
        WHERE reading_id = ${readingId}
        ORDER BY position ASC;
      `;

      // Add cards to the corresponding reading in the map
      cardRows.forEach((card) => {
        if (readingsMap.has(card.reading_id)) {
          readingsMap.get(card.reading_id).cards.push({
            id: card.card_id,
            cardName: card.card_name,
            orientation: card.orientation,
            position: card.position,
          });
        }
      });
    }

    return Array.from(readingsMap.values()) as Reading[];
  } catch (error) {
    console.error("Failed to retrieve readings:", error);
    throw error;
  }
};

// Function to count all readings for a specific user
export const countReadingsByUserId = async (userId): Promise<number> => {
  try {
    const { rows } = await sql`
      SELECT COUNT(*) AS total FROM readings WHERE user_id = ${userId};
    `;
    return parseInt(rows[0].total, 10); // Assuming 'total' is the name of the count column
  } catch (error) {
    console.error("Failed to count readings:", error);
    throw error;
  }
};

// Optional: Update a reading (if needed)
// export const updateReading = async (id: number, updateFields: Partial<Reading>): Promise<Reading | null> => {
//     const setClause = [];
//     const values = [];

//     for (const [key, value] of Object.entries(updateFields)) {
//         setClause.push(`${key} = $${setClause.length + 1}`);
//         values.push(value);
//     }

//     if (setClause.length === 0) {
//         throw new Error("No fields to update");
//     }

//     const query = `UPDATE readings SET ${setClause.join(', ')} WHERE id = $${setClause.length + 1} RETURNING *`;
//     values.push(id);

//     try {
//         const { rows } = await sql(query, ...values);
//         return rows.length > 0 ? rows[0] as Reading : null;
//     } catch (error) {
//         console.error("Failed to update reading:", error);
//         throw error;
//     }
// };

// Optional: Delete a reading
export const deleteReading = async (id: string): Promise<QueryResult> => {
  try {
    return await sql`
            DELETE FROM readings WHERE id = ${id};
        `;
  } catch (error) {
    console.error("Failed to delete reading:", error);
    throw error;
  }
};

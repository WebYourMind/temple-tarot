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
export const getReadingsByUserId = async (userId: number): Promise<Reading[]> => {
  try {
    const { rows } = await sql`
      SELECT readings.id, readings.user_id, readings.user_query, readings.spread_type, readings.created_at, readings.ai_interpretation,
             cards_in_readings.id as card_id, cards_in_readings.card_name, cards_in_readings.orientation, cards_in_readings.position
      FROM readings
      LEFT JOIN cards_in_readings ON readings.id = cards_in_readings.reading_id
      WHERE readings.user_id = ${userId}
      ORDER BY readings.created_at DESC, cards_in_readings.position ASC;
    `;

    // Map to organize readings by id and prevent duplication
    const readingsMap = new Map();

    for (const row of rows) {
      if (!readingsMap.has(row.id)) {
        readingsMap.set(row.id, {
          id: row.id,
          userId: row.user_id,
          userQuery: row.user_query,
          spreadType: row.spread_type,
          createdAt: row.created_at,
          aiInterpretation: row.ai_interpretation,
          cards: [],
        });
      }

      if (row.card_id) {
        // Check if there is a card linked in this row
        readingsMap.get(row.id).cards.push({
          id: row.card_id,
          cardName: row.card_name,
          orientation: row.orientation,
          position: row.position,
        });
      }
    }

    return Array.from(readingsMap.values()); // Convert the map values into an array
  } catch (error) {
    console.error("Failed to retrieve readings:", error);
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

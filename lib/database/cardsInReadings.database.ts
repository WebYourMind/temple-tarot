import { sql } from "@vercel/postgres";

// Define an interface for a Card in a Reading
export interface CardInReading {
  id?: number;
  readingId?: number;
  cardName: string;
  orientation: string;
  position: number;
  imageUrl?: string;
  detail?: {};
  readingTips?: string;
  uprightGuidance?: string;
  reversedGuidance?: string;
}

// Function to add a new card in a reading
export const addCardInReading = async (card: CardInReading): Promise<CardInReading> => {
  try {
    const { rows } = await sql`
            INSERT INTO cards_in_readings (reading_id, card_name, orientation, position)
            VALUES (${card.readingId}, ${card.cardName}, ${card.orientation}, ${card.position})
            RETURNING *;
        `;
    return rows[0] as CardInReading;
  } catch (error) {
    console.error("Failed to add card in reading:", error);
    throw error;
  }
};

// Function to retrieve all cards for a specific reading
export const getCardsByReadingId = async (readingId: number): Promise<CardInReading[]> => {
  try {
    const { rows } = await sql`
            SELECT * FROM cards_in_readings WHERE reading_id = ${readingId};
        `;
    return rows as CardInReading[];
  } catch (error) {
    console.error("Failed to retrieve cards by reading ID:", error);
    throw error;
  }
};

// Optional: Update a card in a reading
// export const updateCardInReading = async (
//   id: number,
//   updateFields: Partial<CardInReading>
// ): Promise<CardInReading | null> => {
//   const setClause = [];
//   const values = [];

//   for (const [key, value] of Object.entries(updateFields)) {
//     setClause.push(`${key} = $${setClause.length + 1}`);
//     values.push(value);
//   }

//   if (setClause.length === 0) {
//     throw new Error("No fields to update");
//   }

//   const query = `UPDATE cards_in_readings SET ${setClause.join(", ")} WHERE id = $${setClause.length + 1} RETURNING *`;
//   values.push(id);

//   try {
//     const { rows } = await sql(query, ...values);
//     return rows.length > 0 ? rows[0] : null;
//   } catch (error) {
//     console.error("Failed to update card in reading:", error);
//     throw error;
//   }
// };

// Optional: Delete a card from a reading
export const deleteCardInReading = async (id: number): Promise<void> => {
  try {
    await sql`
            DELETE FROM cards_in_readings WHERE id = ${id};
        `;
  } catch (error) {
    console.error("Failed to delete card in reading:", error);
    throw error;
  }
};

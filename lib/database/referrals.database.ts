import { sql } from "@vercel/postgres";
import { nanoid } from "nanoid";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 8;

export const generateReferralCode = async (userId) => {
  const code = nanoid(CODE_LENGTH);
  const { rows } = await sql`
    INSERT INTO referral_codes (user_id, code)
    VALUES (${userId}, ${code})
    RETURNING code
  `;
  return rows[0].code;
};

// Function to validate a referral code
export const validateReferralCode = async (code: string) => {
  try {
    const { rows } = await sql`
      SELECT * FROM referral_codes WHERE code = ${code} AND used = FALSE
    `;
    if (rows.length === 0) {
      throw new Error("Invalid or already used referral code");
    }
    return rows[0];
  } catch (error) {
    console.error("Error validating referral code:", error);
    throw new Error("Could not validate referral code");
  }
};

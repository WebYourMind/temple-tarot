import { sql } from "@vercel/postgres";

export async function rateLimitReached(userId) {
  const currentDate = new Date().toISOString().slice(0, 10);

  try {
    // Try to increment the count
    const { rows } = await sql`
            INSERT INTO api_usage_logs (user_id, access_date, request_count)
            VALUES (${userId}, ${currentDate}, 1)
            ON CONFLICT (user_id, access_date)
            DO UPDATE SET request_count = api_usage_logs.request_count + 1
            RETURNING request_count;
        `;

    if (rows[0].request_count > 220) {
      // Limit of 50 requests per day
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    throw Error(error);
  }
}

import { sql } from "@vercel/postgres";

export async function rateLimitReached(userId) {
  const currentDate = new Date().toISOString().slice(0, 10);

  // Fetch user subscription status
  const userSubscription = await sql`
      SELECT is_subscribed, subscription_status FROM users WHERE id = ${userId};
  `;

  const { is_subscribed, subscription_status } = userSubscription.rows[0];
  const maxRequests = is_subscribed && subscription_status === "active" ? 22 : 22; // 1;

  try {
    const { rows } = await sql`
        INSERT INTO api_usage_logs (user_id, access_date, request_count)
        VALUES (${userId}, ${currentDate}, 1)
        ON CONFLICT (user_id, access_date)
        DO UPDATE SET request_count = api_usage_logs.request_count + 1
        RETURNING request_count;
    `;

    const isLimitReached = rows[0].request_count > maxRequests;
    return { isLimitReached, is_subscribed };
  } catch (error) {
    console.error("Error checking rate limit:", error);
    throw Error(error);
  }
}

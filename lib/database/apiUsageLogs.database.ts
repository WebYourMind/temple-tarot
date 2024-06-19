import { sql } from "@vercel/postgres";

export async function rateLimitReached(userId) {
  const currentDate = new Date().toISOString().slice(0, 10);

  // Fetch user subscription status
  const userSubscription = await sql`
      SELECT is_subscribed, pass_expiry, free_readings, email_verified FROM users WHERE id = ${userId};
  `;

  const { is_subscribed, pass_expiry, free_readings, email_verified } = userSubscription.rows[0];

  if (free_readings > 0 && email_verified) {
    await sql`UPDATE users SET free_readings = ${free_readings - 1} WHERE id = ${userId};`;
    return false;
  }

  const isPassValid = pass_expiry && new Date(pass_expiry) > new Date();

  if (!is_subscribed && !isPassValid) return true;

  const maxRequests = 22; // is_subscribed && subscription_status === "active" ? 22 : 22; // 1;

  try {
    const { rows } = await sql`
        INSERT INTO api_usage_logs (user_id, access_date, request_count)
        VALUES (${userId}, ${currentDate}, 1)
        ON CONFLICT (user_id, access_date)
        DO UPDATE SET request_count = api_usage_logs.request_count + 1
        RETURNING request_count;
    `;

    const isLimitReached = rows[0].request_count > maxRequests;
    return isLimitReached;
  } catch (error) {
    console.error("Error checking rate limit:", error);
    throw Error(error);
  }
}

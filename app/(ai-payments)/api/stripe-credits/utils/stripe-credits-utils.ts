import { sql } from "@vercel/postgres";
import Stripe from "stripe";

// Environment variable check for enhanced security and error handling
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Improved error handling and logging for production use
async function handleStripeAction<T>(action: Promise<T>): Promise<T | null> {
  try {
    return await action;
  } catch (error) {
    console.error("Stripe action failed:", error);
    return null; // or throw custom error depending on your error handling strategy
  }
}

export async function findCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
  return handleStripeAction(
    stripe.customers
      .list({
        email: email,
        limit: 1,
      })
      .then((customers) => (customers.data.length > 0 ? customers.data[0] : null))
  );
}

export async function getCustomerEmail(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    // @ts-ignore
    return customer.email;
  } catch (error) {
    console.error("Failed to retrieve customer:", error);
    return null; // Or handle the error as appropriate
  }
}

export async function updateUserSubscriptionStatus(
  email: string,
  isActive: boolean,
  subscriptionId: string,
  subscriptionStatus: string,
  customer: string
) {
  try {
    await sql`
      UPDATE users SET 
        is_subscribed = ${isActive}, 
        subscription_id = ${subscriptionId}, 
        subscription_status = ${subscriptionStatus},
        stripe_customer_id = ${customer} 
      WHERE email = ${email}`;
  } catch (error) {
    console.error("Failed to update user subscription status:", error);
    throw new Error("Database operation failed");
  }
}

export async function logSubscriptionEvent(subscriptionId: string, eventType: string, eventData: Stripe.Subscription) {
  try {
    await sql`
      INSERT INTO subscription_events (user_id, type, stripe_event_id, data, created_at)
      VALUES (
        (SELECT id FROM users WHERE subscription_id = ${subscriptionId}),
        ${eventType},
        ${eventData.id},
        ${JSON.stringify(eventData)},
        NOW()
      )`;
  } catch (error) {
    console.error("Failed to log subscription event:", error);
    throw new Error("Database operation failed");
  }
}

export async function resetSubscriptionCredits(email: string, creditAmount: number) {
  try {
    await sql`
      UPDATE users SET 
        subscription_credits = ${creditAmount}
      WHERE email = ${email}
    `;
  } catch (error) {
    console.error("Failed to reset subscription credits:", error);
    throw new Error("Database operation failed");
  }
}

export async function updateUserAdditionalCredits(email: string, creditsToAdd: number) {
  try {
    await sql`
      UPDATE users 
      SET additional_credits = additional_credits + ${creditsToAdd}
      WHERE email = ${email};
  `;
  } catch (error) {
    console.error("Failed to update user subscription status:", error);
    throw new Error("Database operation failed");
  }
}

export async function logCreditEvent(userId: number, credits: number, eventType: string) {
  await sql`
    INSERT INTO credit_events (user_id, credits, event_type)
    VALUES (${userId}, ${credits}, ${eventType})
  `;
}

export async function spendCredits(userId, amount) {
  const user = await sql`SELECT subscription_credits, additional_credits FROM users WHERE id = ${userId}`;

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const { subscription_credits, additional_credits } = user.rows[0];

  let newSubCredits = subscription_credits;
  let newAddCredits = additional_credits;

  if (amount <= subscription_credits) {
    newSubCredits -= amount;
  } else {
    const remaining = amount - subscription_credits;
    newSubCredits = 0;
    if (remaining <= additional_credits) {
      newAddCredits -= remaining;
    } else {
      throw new Error("Not enough credits");
    }
  }

  await sql`
    UPDATE users SET
      subscription_credits = ${newSubCredits},
      additional_credits = ${newAddCredits}
    WHERE id = ${userId}
  `;

  return { newSubCredits, newAddCredits };
}

export async function getUserSubscription(stripeCustomerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      expand: ["data.items.data.price"],
    });
    return subscriptions.data[0]; // Assuming the user has only one active subscription
  } catch (error) {
    console.error("Failed to fetch user subscription:", error);
    throw new Error("Failed to fetch user subscription");
  }
}

export async function addDayPass(userEmail, passExpiry) {
  await sql`
    UPDATE users SET
      pass_expiry = ${passExpiry}
    WHERE email = ${userEmail}
  `;
}

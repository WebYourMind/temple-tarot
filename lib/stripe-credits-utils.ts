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

// export async function getCustomerBalance(email: string) {
//   const customer = await findCustomerByEmail(email);

//   if (!customer) {
//     return 0;
//   }

//   return parseInt(customer.metadata.credit_balance) || 0;
// }

// export async function createCustomerWithCredits(
//   email: string,
//   totalCreditsPurchased: number
// ): Promise<Stripe.Customer | null> {
//   return handleStripeAction(
//     stripe.customers.create({
//       email,
//       metadata: { credit_balance: totalCreditsPurchased.toString() },
//     })
//   );
// }

// export async function updateCreditsByEmail(
//   email: string,
//   totalCreditsPurchased: number
// ): Promise<Stripe.Customer | null> {
//   let customer = await findCustomerByEmail(email);
//   console.log("Attempting to add credit amount of ", totalCreditsPurchased);

//   if (!customer) {
//     console.log("Creating new customer as no existing customer found with email:", email);
//     customer = await createCustomerWithCredits(email, totalCreditsPurchased);
//     if (!customer) {
//       console.error("Failed to create a new customer with email:", email);
//       return null; // Handling the case where customer creation fails
//     }
//     console.log("New customer created with ID:", customer.id);
//   } else {
//     console.log("Updating credit balance for customer with email:", email);
//     const existingCreditBalance = parseInt(customer.metadata.credit_balance || "0", 10);
//     const newCreditBalance = (!isNaN(existingCreditBalance) ? existingCreditBalance : 0) + totalCreditsPurchased;

//     customer = await handleStripeAction(
//       stripe.customers.update(customer.id, {
//         metadata: { credit_balance: newCreditBalance.toString() },
//       })
//     );

//     if (!customer) {
//       console.error("Failed to update credits for customer with email:", email);
//       return null; // Handling the case where customer update fails
//     }

//     console.log("Customer updated with new credit balance:", customer.metadata.credit_balance);
//   }

//   return customer;
// }

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
  const user =
    await sql`SELECT is_subscribed, subscription_credits, additional_credits FROM users WHERE id = ${userId}`;

  if (user.rows.length === 0) {
    throw new Error("User not found");
  }

  const { is_subscribed, subscription_credits, additional_credits } = user.rows[0];
  if (!is_subscribed) {
    throw new Error("User is not subscribed");
  }

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

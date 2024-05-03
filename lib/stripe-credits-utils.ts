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

export async function getCustomerBalance(email: string) {
  const customer = await findCustomerByEmail(email);

  if (!customer) {
    return 0;
  }

  return parseInt(customer.metadata.credit_balance) || 0;
}

export async function createCustomerWithCredits(
  email: string,
  totalCreditsPurchased: number
): Promise<Stripe.Customer | null> {
  return handleStripeAction(
    stripe.customers.create({
      email,
      metadata: { credit_balance: totalCreditsPurchased.toString() },
    })
  );
}

export async function updateCreditsByEmail(
  email: string,
  totalCreditsPurchased: number
): Promise<Stripe.Customer | null> {
  let customer = await findCustomerByEmail(email);
  console.log("Attempting to add credit amount of ", totalCreditsPurchased);

  if (!customer) {
    console.log("Creating new customer as no existing customer found with email:", email);
    customer = await createCustomerWithCredits(email, totalCreditsPurchased);
    if (!customer) {
      console.error("Failed to create a new customer with email:", email);
      return null; // Handling the case where customer creation fails
    }
    console.log("New customer created with ID:", customer.id);
  } else {
    console.log("Updating credit balance for customer with email:", email);
    const existingCreditBalance = parseInt(customer.metadata.credit_balance || "0", 10);
    const newCreditBalance = (!isNaN(existingCreditBalance) ? existingCreditBalance : 0) + totalCreditsPurchased;

    customer = await handleStripeAction(
      stripe.customers.update(customer.id, {
        metadata: { credit_balance: newCreditBalance.toString() },
      })
    );

    if (!customer) {
      console.error("Failed to update credits for customer with email:", email);
      return null; // Handling the case where customer update fails
    }

    console.log("Customer updated with new credit balance:", customer.metadata.credit_balance);
  }

  return customer;
}

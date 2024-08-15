import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getExpireDate, streamToString } from "lib/utils";
import {
  addDayPass,
  getCustomerEmail,
  logSubscriptionEvent,
  updateUserSubscriptionStatus,
} from "app/(payments)/api/stripe-credits/utils/stripe-credits-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    console.error("Missing Stripe signature.");
    return NextResponse.json({ message: "Missing Stripe signature.", status: 400 });
  }
  if (!request.body) {
    console.error("Missing request body.");
    return NextResponse.json({ message: "Missing request body.", status: 400 });
  }

  const rawBody = await streamToString(request.body);
  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return NextResponse.json({ message: `Webhook signature verification failed: ${error.message}`, status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        // one off payments (not currently being used)
        return await handleCheckoutSessionCompleted(event);
      case "invoice.payment_succeeded":
        return await handleInvoicePaymentSucceeded(event);
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return await handleSubscriptionUpdated(event);
      default:
        console.error(`Unhandled event type: ${event.type}`);
        return NextResponse.json({ message: `Unhandled event type: ${event.type}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 });
  }
}

// one off payments
async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_email;

  if (!email) {
    return NextResponse.json({ message: "Email is required but was not provided." }, { status: 400 });
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"], // Ensure products are fully expanded to access metadata
  });

  if (lineItems.data.length === 0) {
    return NextResponse.json({ message: "No line items found." }, { status: 400 });
  }

  let expiryString = lineItems.data.reduce((acc, item) => {
    // @ts-expect-error
    return item.price.product.metadata.pass_expiry;
  }, 0);

  if (session.mode === "payment" && expiryString) {
    //   // Assuming it's a one off payment for day or week pass
    const passExpiry = getExpireDate(expiryString).toISOString();
    await addDayPass(email, passExpiry);
  }

  return NextResponse.json({ message: "Credits updated successfully." }, { status: 200 });
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  if (!invoice.customer_email || !invoice.subscription) {
    return NextResponse.json({ message: "Required information is missing." }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string, {
    expand: ["items.data.price.product"], // Ensure products are fully expanded to access metadata
  });

  const isActive = subscription.status === "active";

  await updateUserSubscriptionStatus(
    invoice.customer_email,
    isActive,
    subscription.id,
    subscription.status,
    invoice.customer as string
  );

  // // Calculate total credits based on product metadata
  // const totalCredits = subscription.items.data.reduce((acc, item) => {
  //   // @ts-ignore
  //   const credits = parseInt(item.price.product.metadata.credits || "0", 10);
  //   return acc + credits;
  // }, 0);

  // await resetSubscriptionCredits(invoice.customer_email, totalCredits);

  await logSubscriptionEvent(subscription.id, event.id, subscription);

  return NextResponse.json(
    { message: "Invoice payment succeeded, subscription status and credits updated." },
    { status: 200 }
  );
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  if (!subscription.customer) {
    return NextResponse.json({ message: "Customer ID is missing." }, { status: 400 });
  }

  const customerEmail = await getCustomerEmail(subscription.customer.toString());
  const subscriptionId = subscription.id;
  const subscriptionStatus = subscription.status;

  if (!customerEmail) {
    return NextResponse.json({ message: "Customer email not found." }, { status: 400 });
  }

  const subscriptionActive = subscription.status === "active";

  // Update user subscription status
  await updateUserSubscriptionStatus(
    customerEmail,
    subscriptionActive,
    subscriptionId,
    subscriptionStatus,
    subscription.customer as string
  );

  // If subscription is not active, reset the credits to zero
  // if (!subscriptionActive) {
  //   await resetSubscriptionCredits(customerEmail, 0);
  // }

  // Log the subscription event
  await logSubscriptionEvent(subscriptionId, event.type, subscription);

  return NextResponse.json({ message: "User subscription updated successfully." }, { status: 200 });
}

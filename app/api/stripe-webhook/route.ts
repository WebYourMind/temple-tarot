import { NextResponse } from "next/server";
import Stripe from "stripe";
import { streamToString } from "lib/utils";
import { getCustomerEmail, logSubscriptionEvent, updateUserSubscriptionStatus } from "lib/stripe-credits-utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(request: Request) {
  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  if (!request.body) return NextResponse.json({ message: "Missing body" }, { status: 400 });

  const rawBody = await streamToString(request.body);

  try {
    const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
    switch (event.type) {
      // case "checkout.session.completed":
      //   return await handleCheckoutSessionCompleted(event);
      case "invoice.payment_succeeded":
        return await handleInvoicePaymentSucceeded(event);
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return await handleSubscriptionUpdated(event);
      default:
        return NextResponse.json({ message: "Unhandled event type" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: `Webhook Error: ${error.message}` }, { status: 400 });
  }
}

async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  if (!invoice.customer_email || !invoice.subscription) {
    return NextResponse.json({ message: "Required information is missing." }, { status: 400 });
  }

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const isActive = subscription.status === "active";

  await updateUserSubscriptionStatus(
    invoice.customer_email,
    isActive,
    subscription.id,
    subscription.status,
    invoice.customer as string
  );
  await logSubscriptionEvent(subscription.id, event.id, subscription);

  return NextResponse.json({ message: "Invoice payment succeeded, subscription status updated." }, { status: 200 });
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
  await updateUserSubscriptionStatus(
    customerEmail,
    subscriptionActive,
    subscriptionId,
    subscriptionStatus,
    subscription.customer as string
  );
  await logSubscriptionEvent(subscriptionId, event.type, subscription);

  return NextResponse.json({ message: "User subscription updated successfully." }, { status: 200 });
}

// async function handleCheckoutSessionCompleted(event: Stripe.Event) {
//   const session = event.data.object as Stripe.Checkout.Session;
//   const email = session.customer_email;

//   if (!email) {
//     return NextResponse.json({ message: "Email is required but was not provided." }, { status: 400 });
//   }

//   const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
//   if (lineItems.data.length === 0) {
//     return NextResponse.json({ message: "No line items found." }, { status: 400 });
//   }

//   const priceId = lineItems.data[0].price?.id;
//   if (!priceId) {
//     return NextResponse.json({ message: "Price ID is required but was not found." }, { status: 400 });
//   }

//   const price = await stripe.prices.retrieve(priceId);
//   if (price.product) {
//     const product = await stripe.products.retrieve(price.product as string);

//     const creditsToAdd = parseInt(product.metadata.credits, 10);
//     console.log("adding credits: ", creditsToAdd);
//     return await addCredits(creditsToAdd, email);
//   } else {
//     console.log("The price object does not contain a product ID.");
//     return NextResponse.json({ message: "The price object does not contain a product ID." }, { status: 400 });
//   }
// }

// async function addCredits(creditsToAdd: number, email: string) {
//   if (!isNaN(creditsToAdd)) {
//     try {
//       await updateCreditsByEmail(email, creditsToAdd);
//       return NextResponse.json({ message: "Credits updated successfully." }, { status: 200 });
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error(`Error: ${error.message}`);
//         return NextResponse.json({ message: `Error: ${error.message}` }, { status: 500 });
//       } else {
//         // Fallback for other cases
//         console.error("An unexpected error occurred:", error);
//         return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
//       }
//     }
//   } else {
//     console.log("No valid credits found in product metadata.");
//     return NextResponse.json({ message: "No valid credits found in product metadata." }, { status: 400 });
//   }
// }

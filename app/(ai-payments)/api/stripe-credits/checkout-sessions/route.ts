import { addStripeCustomerId } from "lib/database/user.database";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const reqBody = (await req.json()) as {
    priceId: string;
    customerId?: string;
    email?: string;
    mode?: "subscription" | "payment";
  };

  const { priceId, customerId, email, mode } = reqBody;
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of
          // the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode || "payment",
      allow_promotion_codes: true,
      // @ts-ignore
      return_url: `${origin}/purchase-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      ...(customerId ? { customer: customerId } : {}),
      ...(email ? { customer_email: email } : {}),
    });

    await addStripeCustomerId(email, customerId);

    return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (err: any) {
    return NextResponse.json(err.message, { status: err.statusCode || 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");
    // @ts-ignore
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    // @ts-ignore
    return NextResponse.json(
      { customer_email: session.customer_details?.email, status: session.status },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}

import { getSession } from "lib/auth";
import { getUserById } from "lib/database/user.database";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const userId = (await getSession())?.user.id;
  try {
    const user = await getUserById(userId);

    const { stripe_customer_id } = user;

    // This is the url to which the customer will be redirected when they are done
    // managing their billing with the portal.
    const returnUrl = origin;

    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        // @ts-ignore
        customer: stripe_customer_id,
        return_url: returnUrl,
      });
      return NextResponse.json({ url: portalSession.url });
    } catch (portalError) {
      console.error("Failed to create billing portal session:", portalError);
      return NextResponse.json(
        { error: "Failed to create billing portal session", details: portalError },
        { status: 500 }
      );
    }
    //   res.send({ clientSecret: session.client_secret });
    // return NextResponse.json({ clientSecret: session.client_secret, sessionId: session.id });
  } catch (err: any) {
    console.error("Failed to create billing portal session:", err);
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

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  try {
    const priceIds = [
      process.env.STRIPE_PRICE_ONE,
      process.env.STRIPE_PRICE_TWO,
      process.env.STRIPE_PRICE_THREE,
    ].filter(Boolean); // Filter out undefined

    const pricesPromises = priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] }));
    const prices = await Promise.all(pricesPromises);

    const simplifiedPrices = prices
      .map((price) => ({
        id: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        // @ts-ignore
        productName: price.product.name,
        // @ts-ignore
        productDescription: price.product.description,
        type: price.type,
      }))
      .sort((a, b) => a.unitAmount - b.unitAmount);

    return NextResponse.json(simplifiedPrices, { status: 200 });
  } catch (error) {
    console.error("Error fetching prices from Stripe:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

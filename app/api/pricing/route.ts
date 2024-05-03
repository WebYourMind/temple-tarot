import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const price1 = process.env.STRIPE_PRICE_ONE as string;
// const price2 = process.env.STRIPE_PRICE_TWO as string;
// const price3 = process.env.STRIPE_PRICE_THREE as string;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  // const { searchParams } = new URL(req.url);
  // const type = searchParams.get("type") as "one_time" | "recurring";
  try {
    const priceIds = [price1];
    const pricesPromises = priceIds.map((priceId) => stripe.prices.retrieve(priceId, { expand: ["product"] }));
    const prices = await Promise.all(pricesPromises);

    // Simplify the data structure for the frontend
    const simplifiedPrices = prices.map((price) => ({
      id: price.id,
      unitAmount: price.unit_amount,
      currency: price.currency,
      // @ts-ignore
      productName: price.product.name,
      // @ts-ignore
      productDescription: price.product.description,
      type: price.type,
    }));

    const sortedSimplifiedPrices = simplifiedPrices.sort((a, b) => {
      // Convert null to 0 for comparison
      const amountA = a.unitAmount || 0;
      const amountB = b.unitAmount || 0;
      return amountA - amountB;
    });

    return NextResponse.json(sortedSimplifiedPrices, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching prices from Stripe:", error);
    return NextResponse.json({ message: error.message }, { status: 200 });
  }
}

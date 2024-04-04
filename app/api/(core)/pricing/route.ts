import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as "one_time" | "recurring";
  try {
    // Retrieve prices and expand the product data for each
    const prices = await stripe.prices.list({
      limit: 10, // Adjust based on how many prices you want to fetch
      expand: ["data.product"], // Expand product details
      type,
    });

    // Simplify the data structure for the frontend
    const simplifiedPrices = prices.data.map((price) => ({
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

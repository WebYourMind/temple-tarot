import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function GET(req: NextRequest) {
  try {
    // Retrieve all active prices and expand product details
    const prices = await stripe.prices.list({
      active: true, // Ensure only active prices are retrieved
      expand: ["data.product"], // Ensure product details are fetched
      limit: 100, // Adjust the limit as necessary
    });

    // Filter prices to include only those with 'credits' metadata and map the necessary details
    const simplifiedPrices = prices.data
      .filter((price) => {
        // @ts-expect-error
        // Check both the presence of 'credits' in metadata and a custom 'isArchived' flag
        return price.product?.metadata?.credits && price.product.active && !price.product?.metadata?.isArchived;
      })
      .map((price) => ({
        id: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency,
        // @ts-expect-error
        productName: price.product?.name,
        // @ts-expect-error
        productDescription: price.product?.description,
        type: price.type, // This already distinguishes between 'one_time' and 'recurring'
        // @ts-expect-error
        credits: price.product?.metadata?.credits, // Include the credits from metadata
      }))
      .sort((a, b) => a.unitAmount - b.unitAmount);

    return NextResponse.json(simplifiedPrices, { status: 200 });
  } catch (error) {
    console.error("Error fetching prices from Stripe:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

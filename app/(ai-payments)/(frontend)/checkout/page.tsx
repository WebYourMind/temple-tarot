"use client";

import React, { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import Loading from "components/loading";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Checkout() {
  const { data: session } = useSession() as any;
  const user = session?.user as User;
  const searchParams = useSearchParams();
  const fetchClientSecret = useCallback(async () => {
    const product = searchParams?.get("product");
    const mode = searchParams?.get("mode");

    const res = await fetch("/api/stripe-credits/checkout-sessions", {
      method: "POST",
      body: JSON.stringify({ priceId: product, email: user.email, mode }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await res.json()) as { clientSecret: string };
    return data.clientSecret;
  }, [user]);

  const options = { fetchClientSecret };

  if (user) {
    return (
      <div className="py-8" id="checkout">
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  } else {
    return <Loading />;
  }
}

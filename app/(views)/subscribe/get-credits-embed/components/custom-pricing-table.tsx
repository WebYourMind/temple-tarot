"use client";

import React, { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Button } from "components/ui/button";

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(
  "pk_test_51OyDNCDR56uACr3sxVYSc9t8Uvcylfvq96ANsbIpOLxuIIcL4aaKXuf20DdYNV9lySm3EiHjiuRyyrsQuchoqONA00ws6aKe4j"
);

interface SimplifiedPrice {
  id: string;
  unitAmount: number | null;
  currency: string;
  productName: string;
  productDescription: string | null;
}

interface CheckoutSessionResponse {
  sessionId: string;
}

const CustomPricingTable: React.FC = () => {
  const [plans, setPlans] = useState<SimplifiedPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch your plans/products from Stripe
    const fetchPlans = async () => {
      const res = await fetch("/api/pricing"); // Adjust to your API endpoint
      const data = (await res.json()) as SimplifiedPrice[];
      setPlans(data);
      setLoading(false);
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (priceId: string) => {
    // Assuming you have a session ID creation endpoint on your server
    const stripe: Stripe | null = await stripePromise;
    const sessionRes = await fetch("/api/checkout-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    });
    const sessionData = (await sessionRes.json()) as CheckoutSessionResponse;

    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: sessionData.sessionId,
      });

      if (result.error) {
        alert(result.error.message);
      }
    }
  };

  if (loading) return <div>Loading plans...</div>;

  return (
    <div className="flex flex-wrap justify-center">
      {plans.map((plan) => (
        <div key={plan.id} className="m-4 rounded border p-4 shadow-lg">
          <h3 className="text-lg font-bold">{plan.productName}</h3>
          <p>{plan.productDescription}</p>
          <p className="my-2">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: plan.currency,
            }).format(plan.unitAmount! / 100)}{" "}
            {/* Assuming unitAmount is in cents */}
          </p>
          <Button onClick={() => handleSelectPlan(plan.id)}>Buy Now</Button>
        </div>
      ))}
    </div>
  );
};

export default CustomPricingTable;

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import Loading from "components/loading";
import { useRouter } from "next/navigation";

interface SimplifiedPrice {
  id: string;
  unitAmount: number | null;
  currency: string;
  productName: string;
  type: string;
  productDescription: string | null;
}

const CustomPricingTable: React.FC = () => {
  const [plans, setPlans] = useState<SimplifiedPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const route = useRouter();

  useEffect(() => {
    // Fetch your plans/products from Stripe
    const fetchPlans = async () => {
      const res = await fetch("/api/pricing?type=one_time");
      const data = (await res.json()) as SimplifiedPrice[];
      setPlans(data);
      setLoading(false);
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (priceId: string, type: string) => {
    route.push(`/credits/checkout?product=${priceId}${type === "recurring" ? "&mode=subscription" : ""}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="container grid w-full max-w-5xl gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="p-8 shadow-lg">
          <h3 className="mb-4 text-xl font-bold">{plan.productName}</h3>
          <p className="text-sm opacity-70">{plan.productDescription}</p>
          <p className="my-6 text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: plan.currency,
            }).format(plan.unitAmount! / 100)}{" "}
            {/* Assuming unitAmount is in cents */}
          </p>
          <Button size={"lg"} className="w-full" onClick={() => handleSelectPlan(plan.id, plan.type)}>
            Pay
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomPricingTable;

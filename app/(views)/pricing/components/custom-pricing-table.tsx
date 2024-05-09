"use client";

import React, { useState, useEffect } from "react";
import { Button } from "components/ui/button";
import Loading from "components/loading";
import { useRouter } from "next/navigation";
import { manageSubscription } from "components/navigation/user-menu";

interface SimplifiedPrice {
  id: string;
  unitAmount: number | null;
  currency: string;
  productName: string;
  type: string;
  productDescription: string | null;
  isSubscribed: boolean; // Assuming this is added to each price object
}

const CustomPricingTable: React.FC = () => {
  const [plans, setPlans] = useState<SimplifiedPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      const res = await fetch("/api/stripe-credits/pricing");
      const data = (await res.json()) as SimplifiedPrice[];
      setPlans(data.filter((plan) => plan.type === "recurring" || plan.type === "one_time"));
      setLoading(false);
    };

    fetchPlans();
  }, []);

  const handleSelectPlan = async (priceId: string, type: string, isSubscribed: boolean) => {
    if (isSubscribed) {
      // Navigate to manage subscription page
      // router.push(`/pricing/manage`);
      await manageSubscription();
    } else {
      // Navigate to the checkout page
      router.push(`/pricing/checkout?product=${priceId}${type === "recurring" ? "&mode=subscription" : ""}`);
    }
  };

  if (loading) return <Loading />;
  return (
    <div className="container w-full max-w-5xl justify-center md:flex">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-md p-8">
          <h3 className="mb-4 text-xl font-bold">{plan.productName}</h3>
          <p className="text-sm opacity-70">{plan.productDescription}</p>
          <p className="my-6 text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: plan.currency,
            }).format(plan.unitAmount! / 100)}{" "}
            {plan.type === "recurring" ? <span className="text-sm">/ per month</span> : ""}
          </p>
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={() => handleSelectPlan(plan.id, plan.type, plan.isSubscribed)}
          >
            {plan.type === "recurring" ? (plan.isSubscribed ? "Manage Subscription" : "Subscribe") : "Buy Credits"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CustomPricingTable;

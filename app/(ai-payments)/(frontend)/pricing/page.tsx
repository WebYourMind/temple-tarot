"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  isSubscribed: boolean;
}

const fetchPlans = async () => {
  try {
    const response = await fetch("/api/stripe-credits/pricing");
    if (!response.ok) throw new Error("Failed to fetch plans.");
    return response.json() as Promise<SimplifiedPrice[]>;
  } catch (error) {
    console.error("Fetching plans failed:", error);
    return [];
  }
};

const Pricing: React.FC = () => {
  const [plans, setPlans] = useState<SimplifiedPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    fetchPlans().then((data) => {
      setPlans(data);
      setLoading(false);
    });
  }, []);

  const subscriptions = useMemo(() => plans.filter((plan) => plan.type === "recurring"), [plans]);
  const oneTimeProducts = useMemo(() => plans.filter((plan) => plan.type === "one_time"), [plans]);

  const handleSelectPlan = (priceId: string, type: string, isSubscribed: boolean) => {
    const path = `/checkout?product=${priceId}${type === "recurring" ? "&mode=subscription" : ""}`;
    router.push(isSubscribed ? "/manage-subscription" : path);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <div className="container w-full max-w-5xl justify-center md:flex md:flex-col">
        <Section title="Subscriptions" plans={subscriptions} handleSelectPlan={handleSelectPlan} />
        <Section title="One-Time Purchases" plans={oneTimeProducts} handleSelectPlan={handleSelectPlan} />
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  plans: SimplifiedPrice[];
  handleSelectPlan: (priceId: string, type: string, isSubscribed: boolean) => void;
}> = ({ title, plans, handleSelectPlan }) => (
  <section>
    <h2 className="mb-4 text-2xl font-bold">{title}</h2>
    <div className="flex justify-center pb-16">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-md p-8 md:w-1/3">
          <h3 className="mb-4 text-xl font-bold">{plan.productName}</h3>
          <p className="text-sm opacity-70">{plan.productDescription}</p>
          <p className="my-6 text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: plan.currency,
            }).format(plan.unitAmount! / 100)}
            {plan.type === "recurring" && <span className="text-sm">/ per month</span>}
          </p>
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={() => handleSelectPlan(plan.id, plan.type, plan.isSubscribed)}
          >
            {plan.isSubscribed ? "Manage Subscription" : plan.type === "recurring" ? "Subscribe" : "Buy Credits"}
          </Button>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing;

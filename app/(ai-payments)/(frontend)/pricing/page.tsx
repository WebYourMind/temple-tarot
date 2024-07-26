"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "components/ui/button";
import Loading from "components/loading";
import Faq from "./faq";
import { manageSubscription } from "../utils";
import CurrentPass from "./current-pass";

interface SimplifiedPrice {
  id: string;
  unitAmount: number | null;
  currency: string;
  productName: string;
  type: string;
  productDescription: string | null;
  isSubscribed: boolean;
}

const fetchPlans = async (): Promise<SimplifiedPrice[]> => {
  try {
    const response = await fetch("/api/stripe-credits/pricing");
    if (!response.ok) throw new Error("Failed to fetch plans.");
    // @ts-ignore
    return response.json();
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

  const handleSelectPlan = async (priceId: string, type: string, isSubscribed: boolean) => {
    const path = `/checkout?product=${priceId}${type === "recurring" ? "&mode=subscription" : ""}`;
    if (!isSubscribed) {
      router.push(path);
    } else {
      await manageSubscription();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen pt-8 md:pt-16">
      <div className="mx-auto w-full max-w-5xl space-y-16 px-4 md:container">
        <CurrentPass />
        <header className="mb-16 md:text-center">
          <h1 className="mb-4 text-4xl font-bold">Pricing</h1>
          <p className="mb-6 text-lg opacity-70">
            Discover our flexible pricing options designed to meet your needs. Whether you&apos;re looking for short or
            long term, we&apos;ve got you covered.
          </p>
        </header>
        <div>
          {subscriptions.length > 0 && (
            <Section title="Subscriptions" plans={subscriptions} handleSelectPlan={handleSelectPlan} />
          )}
        </div>
        <div>
          {oneTimeProducts.length > 0 && (
            <Section title="One-Time Purchases" plans={oneTimeProducts} handleSelectPlan={handleSelectPlan} />
          )}
        </div>
        <Faq />
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  plans: SimplifiedPrice[];
  handleSelectPlan: (priceId: string, type: string, isSubscribed: boolean) => void;
}> = ({ title, plans, handleSelectPlan }) => (
  <section className="mb-16">
    <h2 className="mb-8 text-3xl font-semibold md:text-center">{title}</h2>
    <div className="flex flex-col space-y-8 md:flex-row md:justify-center md:space-x-8 md:space-y-0">
      {plans.map((plan, i) => (
        <div key={plan.id} className="rounded-md md:w-1/3 md:p-8">
          <h3 className="mb-4 text-xl font-bold">{plan.productName}</h3>
          <p className="text-sm opacity-70">{plan.productDescription}</p>
          <p className="my-6 text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: plan.currency,
            }).format(plan.unitAmount! / 100)}
            {plan.type === "recurring" && <span className="text-sm">/ per {i === 1 ? "year" : "month"}</span>}
          </p>
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={() => handleSelectPlan(plan.id, plan.type, plan.isSubscribed)}
          >
            {plan.isSubscribed ? "Manage Subscription" : plan.type === "recurring" ? "Subscribe" : "Buy"}
          </Button>
        </div>
      ))}
    </div>
  </section>
);

export default Pricing;

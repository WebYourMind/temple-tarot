"use client";

import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Card from "components/card";
import Link from "next/link";
import { Button, buttonVariants } from "components/ui/button";
import { cn } from "lib/utils";
import { useSession } from "next-auth/react";

export default function PurchaseConfirmation() {
  const { update } = useSession() as any;
  const [status, setStatus] = useState(null);
  // const [customerEmail, setCustomerEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    async function getCheckoutSession() {
      const sessionId = searchParams?.get("session_id");

      const response = await fetch(`/api/stripe-credits/checkout-sessions?session_id=${sessionId}`, {
        method: "GET",
      });
      const data = (await response.json()) as any;
      console.log(data);

      // update the user session
      await update({ isSubscribed: data.status === "complete" });

      setStatus(data.status);
      // setCustomerEmail(data.customer_email);
    }

    getCheckoutSession();
  }, [searchParams]);

  async function manageSubscription() {
    try {
      const response = await fetch("/api/stripe-credits/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create billing portal session");
      }

      const data = await response.json();
      if (response.ok) {
        // @ts-ignore
        window.location.href = data.url; // Redirect user to the Stripe portal
      } else {
        // @ts-ignore
        throw new Error(data.message || "Failed to initiate billing portal session");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <div className="min-h-screen pt-8 md:pt-16">
        <div className="container mx-auto max-w-4xl">
          <section id="success">
            <Card className="py-8">
              <>
                <h1 className="mb-6 text-3xl font-bold">Thank you!</h1>
                <p>We appreciate your business and wish you good fortune on your journey ahead.</p>
                <div className="space-x-2">
                  <Link className={cn(buttonVariants(), "mt-5")} href={"/"}>
                    Go to Tarot
                  </Link>
                  <Button variant="outline" onClick={manageSubscription}>
                    Manage Subscription
                  </Button>
                </div>
              </>
            </Card>
          </section>
        </div>
      </div>
    );
  }

  return null;
}

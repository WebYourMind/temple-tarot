"use client";

import React, { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Card from "components/card";
import Link from "next/link";
import { buttonVariants } from "components/ui/button";
import { cn } from "lib/utils";

export default function PurchaseConfirmation() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    async function getCheckoutSession() {
      const sessionId = searchParams?.get("session_id");

      const response = await fetch(`/api/checkout-sessions?session_id=${sessionId}`, {
        method: "GET",
      });
      const data = (await response.json()) as any;
      console.log(data);

      setStatus(data.status);
      setCustomerEmail(data.customer_email);
    }

    getCheckoutSession();
  }, [searchParams]);

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <div className="container mx-auto max-w-4xl">
        <section id="success">
          <Card className="py-8">
            <>
              <h1 className="mb-6 text-3xl font-bold">Thank you!</h1>
              <p>
                We appreciate your business! A confirmation email will be sent to {customerEmail}. If you have any
                questions, please email <a href="mailto:orders@example.com">orders@example.com</a>. You may need to
                refresh the page to see your updated balance.
              </p>
              <Link className={cn(buttonVariants(), "mt-5")} href={"/"}>
                Go to Tarot
              </Link>
            </>
          </Card>
        </section>
      </div>
    );
  }

  return null;
}

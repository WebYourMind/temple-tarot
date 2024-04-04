"use client";

import Loading from "components/loading";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import StripePricingTable from "./stripe-pricing-table";

const pricingTableId = process.env.pricingTableId as string;
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

const MyPricingTable = () => {
  const { data: session } = useSession() as any;
  const user = session?.user as User;
  if (user) {
    return (
      <div className="flex w-full flex-1 flex-col">
        <StripePricingTable
          userEmail={user.email as string}
          userId={user.id}
          publishableKey={publishableKey}
          pricingTableId={pricingTableId}
        />
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default MyPricingTable;

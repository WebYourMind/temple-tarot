"use client";

import React, { useEffect } from "react";

interface StripePricingTableProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  "pricing-table-id": string;
  "publishable-key": string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": StripePricingTableProps;
    }
  }
}

type Props = {
  userEmail: string;
  publishableKey: string;
  pricingTableId: string;
};

const StripePricingTable = ({ userEmail, publishableKey, pricingTableId }: Props) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col">
      <stripe-pricing-table
        pricing-table-id={pricingTableId}
        publishable-key={publishableKey}
        // client-reference-id={userId}
        customer-email={userEmail}
        allow-top-navigation={true}
      ></stripe-pricing-table>
    </div>
  );
};

export default StripePricingTable;

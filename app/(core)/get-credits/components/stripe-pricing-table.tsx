"use client";

import { User } from "next-auth";
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
  user: User;
};

const StripePricingTable = ({ user }: Props) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/pricing-table.js";
    script.async = true;

    document.body.appendChild(script);
    console.log("insert script");
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col">
      <stripe-pricing-table
        pricing-table-id="prctbl_1OyDusDR56uACr3s9RtUIyW7"
        publishable-key="pk_test_51OyDNCDR56uACr3sxVYSc9t8Uvcylfvq96ANsbIpOLxuIIcL4aaKXuf20DdYNV9lySm3EiHjiuRyyrsQuchoqONA00ws6aKe4j"
        // client-reference-id={user.id}
        // customer-email={user.email}
      ></stripe-pricing-table>
    </div>
  );
};

export default StripePricingTable;

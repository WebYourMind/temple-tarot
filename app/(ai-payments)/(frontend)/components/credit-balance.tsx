"use client";

import { StarIcon } from "@radix-ui/react-icons";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";

export function CreditBalance() {
  const { credits, isLoading } = useCredits();
  return (
    <div className="text-primary">
      {isLoading ? <StarIcon className="mb-1 inline h-4 w-4 animate-spin" /> : credits} Credit{credits != 1 ? "s" : ""}
    </div>
  );
}

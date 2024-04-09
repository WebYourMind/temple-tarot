"use client";

import { StarIcon } from "@radix-ui/react-icons";
import { useCredits } from "lib/contexts/credit-context";

export function CreditBalance() {
  const { credits, isLoading } = useCredits();
  return <div>{isLoading ? <StarIcon className="mb-1 inline h-4 w-4 animate-spin" /> : credits} Lumens</div>;
}
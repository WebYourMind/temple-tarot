"use client";

import { TriangleUpIcon } from "@radix-ui/react-icons";
import { useCredits } from "lib/contexts/credit-context";

export function CreditBalance() {
  const { credits, isLoading } = useCredits();
  return <div>{isLoading ? <TriangleUpIcon className="inline h-8 w-8 animate-spin" /> : credits} Credits</div>;
}

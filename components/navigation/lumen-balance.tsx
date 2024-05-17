"use client";

import { StarIcon } from "@radix-ui/react-icons";
import { useLumens } from "lib/contexts/lumen-context";

export function LumenBalance() {
  const { lumens, isLoading } = useLumens();
  return (
    <div className="text-primary">
      {isLoading ? <StarIcon className="mb-1 inline h-4 w-4 animate-spin" /> : lumens}L
    </div>
  );
}

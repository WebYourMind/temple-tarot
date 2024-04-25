import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import tarotSpreads from "./tarot-spreads";

export function SpreadSelector({ onSpreadSelect, selectedSpread }) {
  const handleSpreadSelect = (spreadValue) => {
    const selectedSpread = tarotSpreads.find((spread) => spread.value === spreadValue);
    onSpreadSelect(selectedSpread);
  };
  return (
    <Select onValueChange={handleSpreadSelect} value={selectedSpread?.value || "single_card"}>
      <SelectTrigger className="truncate-text mb-2 w-72">
        <SelectValue placeholder="Choose a spread" />
      </SelectTrigger>
      <SelectContent className="fixed inset-x-0 top-0 z-50 max-h-[30vh] w-72 overflow-y-auto shadow-lg md:max-h-[40vh]">
        <SelectGroup>
          <SelectLabel className="px-4 pb-2 pt-4 text-sm font-semibold ">Spreads</SelectLabel>
          {tarotSpreads.map((spread) => (
            <SelectItem key={spread.value} value={spread.value} className="cursor-pointer">
              <div className="flex flex-col">
                <p className="my-0 text-sm font-semibold">{spread.name}</p>
                <p className="mb-1 text-xs font-bold opacity-80">
                  {spread.numberOfCards} card{spread.numberOfCards > 1 ? "s" : ""}
                </p>
                <p className="mt-0 text-xs opacity-80">{spread.description}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

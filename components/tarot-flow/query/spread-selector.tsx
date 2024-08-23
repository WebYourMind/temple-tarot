import * as React from "react";

import tarotSpreads from "lib/tarot-data/tarot-spreads";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import { cn } from "lib/utils";
import { buttonVariants } from "components/ui/button";

function SpreadSelector() {
  const { spread, setSpread, setSpreadPickerOpen, spreadPickerOpen } = useTarotFlow();
  const handleSpreadSelect = (spreadValue) => {
    const selectedSpread = tarotSpreads.find((spread) => spread.value === spreadValue);
    setSpread(selectedSpread);
    setSpreadPickerOpen(false);
  };
  return (
    <>
      <Dialog open={spreadPickerOpen} onOpenChange={() => setSpreadPickerOpen(!spreadPickerOpen)}>
        <DialogTrigger className={cn("flex w-full items-center justify-center space-x-2", buttonVariants())}>
          <span>{spread?.name}</span> <ChevronDown className="h-4 w-4 opacity-50" />
        </DialogTrigger>
        <DialogContent className="my-16 max-h-[80vh] max-w-[90vw] overflow-scroll rounded-md ">
          <h2>Spreads</h2>
          {tarotSpreads.map((spread) => (
            <button
              key={spread.value}
              value={spread.value}
              onClick={() => handleSpreadSelect(spread.value)}
              className="w-full cursor-pointer rounded-md border border-transparent py-6 transition md:px-4 md:hover:border-primary md:hover:underline"
            >
              <div className="flex flex-col justify-start text-left">
                <p className="my-0 text-lg font-semibold">{spread.name}</p>
                <p className="mb-1 font-bold opacity-80">
                  {spread.numberOfCards} card{spread.numberOfCards > 1 ? "s" : ""}
                </p>
                <p className="mt-0 opacity-80">{spread.description}</p>
              </div>
            </button>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SpreadSelector;

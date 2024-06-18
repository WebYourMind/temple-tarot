import * as React from "react";

import tarotSpreads from "lib/tarot-data/tarot-spreads";
import { DialogContent, DialogTrigger } from "components/ui/dialog";
import { ChevronDown } from "lucide-react";
import { useTarotSession } from "lib/contexts/tarot-session-context";

function SpreadSelector() {
  const { spreadType, setSpreadType, setSpreadPickerOpen } = useTarotSession();
  const handleSpreadSelect = (spreadValue) => {
    const selectedSpread = tarotSpreads.find((spread) => spread.value === spreadValue);
    setSpreadType(selectedSpread);
    setSpreadPickerOpen(false);
  };
  return (
    <>
      <DialogTrigger className="flex space-x-2">
        <span>{spreadType?.name}</span> <ChevronDown />
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
    </>
  );
}

export default SpreadSelector;

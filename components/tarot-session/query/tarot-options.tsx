import { InfoButton } from "components/info-dialog";
import DeckSelector from "./deck-selector";
import SpreadSelector from "./spread-selector";
import { Checkbox } from "components/ui/checkbox";
import { useState } from "react";
import CardInput from "./card-input";
import { cn } from "lib/utils";
import { buttonVariants } from "components/ui/button";

function TarotOptions() {
  const [showCardInput, setShowCardInput] = useState();
  return (
    <div className="space-y-4 overflow-y-scroll">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h3>Tarot Preferences</h3>
        <DeckSelector />
        <div className="flex w-full">
          <SpreadSelector />
          <InfoButton type="spread" />
        </div>
      </div>
      <div className="flex justify-center pb-2">
        <div
          className={cn(
            // "flex w-full items-center justify-center rounded-md border border-foreground bg-background px-3 py-2",
            "w-full",
            buttonVariants(),
            showCardInput && "border-primary text-primary"
          )}
        >
          <Checkbox
            className="hidden"
            id="terms1"
            checked={showCardInput}
            onCheckedChange={setShowCardInput as () => void}
          />
          <div className="grid leading-none">
            <label
              htmlFor="terms1"
              className={"flex items-center text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"}
            >
              Use a Physical Deck
            </label>
          </div>
        </div>
        <InfoButton type="physical" />
      </div>
      {showCardInput && <CardInput />}
    </div>
  );
}

export default TarotOptions;

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
        <DeckSelector />
        <div className="flex w-full">
          <SpreadSelector />
          <InfoButton type="spread" />
        </div>
      </div>
    </div>
  );
}

export default TarotOptions;

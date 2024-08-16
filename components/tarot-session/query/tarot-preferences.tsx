"use client";

import { InfoButton } from "components/info-dialog";
import { cn } from "lib/utils";
import CardInput from "./card-input";
import DeckSelector from "./deck-selector";
import { MagicFont } from "./query-input";
import SpreadSelector from "./spread-selector";
import { memo, useEffect, useState } from "react";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Input } from "components/ui/input";

function TarotPreferences({ drawCards }) {
  const { setHasOwnCards, setSelectedCards, usersName, setUsersName } = useTarotSession();
  const [showCardInput, setShowCardInput] = useState(false);

  useEffect(() => {
    setHasOwnCards(showCardInput);
    if (!showCardInput) {
      setSelectedCards(null);
    }
  }, [showCardInput]);
  return (
    <div className={cn("h-full w-full px-1", drawCards ? "opacity-100" : "pointer-events-none h-0 opacity-0")}>
      <div className="mb-4 flex items-center border-b">
        <Label>For:</Label>
        <Input
          placeholder="Who is this reading is for?"
          className="rounded-none border-none bg-transparent focus-within:ring-offset-0 focus-visible:ring-offset-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0"
          value={usersName}
          onChange={({ target: { value } }) => setUsersName(value)}
        />
      </div>
      <DeckSelector />
      <div className="flex w-full">
        <SpreadSelector />
        <InfoButton type="spread" />
      </div>
      <div className="my-4 flex w-full items-center justify-between space-x-2">
        <Label htmlFor="draw-cards-switch" className={cn("text-sm", MagicFont.className)}>
          I am using a physical deck
        </Label>
        <Switch
          id="draw-cards-switch"
          checked={showCardInput}
          onCheckedChange={(checked) => setShowCardInput(checked)}
        />
      </div>
      {showCardInput && <CardInput />}
    </div>
  );
}

export default memo(TarotPreferences);

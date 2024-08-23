"use client";

import { InfoButton } from "components/info-dialog";
import Loading from "app/loading";
import { buttonVariants } from "components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { decks } from "lib/tarot-data/tarot-deck";
import { cn } from "lib/utils";

export default function DeckSelector() {
  const { selectedDeck, setSelectedDeck } = useTarotSession();
  const handleDeckChange = (deckValue) => {
    setSelectedDeck(decks.find((deck) => deck.value === deckValue));
  };

  if (!selectedDeck || !selectedDeck.value || !decks) return <Loading />;

  return (
    <div className="mb-4 w-full space-y-2 text-center">
      <Select onValueChange={handleDeckChange} value={selectedDeck.value}>
        <div className="flex w-full">
          <SelectTrigger className={cn(buttonVariants())}>
            <SelectValue placeholder="Select deck" />
          </SelectTrigger>
          <InfoButton type="deck" />
        </div>
        <SelectContent ref={(ref) => ref?.addEventListener("touchend", (e) => e.preventDefault())} className="z-50">
          <SelectGroup>
            <SelectLabel>Decks</SelectLabel>
            {decks.map((deck) => (
              <SelectItem
                key={deck.value}
                value={deck.value}
                className={"cursor-pointer bg-background md:hover:underline"}
              >
                {deck.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

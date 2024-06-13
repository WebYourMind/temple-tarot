"use client";

import { Label } from "components/ui/label";
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

export default function DeckSelector() {
  const { selectedDeck, setSelectedDeck } = useTarotSession();
  const handleDeckChange = (deckValue) => {
    setSelectedDeck(decks.find((deck) => deck.value === deckValue));
  };

  if (!selectedDeck) return null;

  return (
    <div className="mb-4 space-y-2 text-center">
      <Label>Choose a deck:</Label>
      <Select onValueChange={handleDeckChange} value={selectedDeck.value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select deck" />
        </SelectTrigger>
        <SelectContent ref={(ref) => ref?.addEventListener("touchend", (e) => e.preventDefault())} className="z-50">
          <SelectGroup>
            <SelectLabel>Decks</SelectLabel>
            {decks.map((deck) => (
              <SelectItem key={deck.value} value={deck.value}>
                {deck.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

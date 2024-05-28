import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { deckCardsMapping } from "./tarot-deck";
import { CardType } from "lib/types";

const decks = [
  // { value: "custom", name: "Custom Deck", promptName: "Custom deck (see card definitions for interpretations)" },
  { value: "thoth", name: "Thoth Deck", promptName: "Thoth Deck by Aleister Crowley" },
  { value: "ryder_waite", name: "Ryder Waite Deck", promptName: "Ryder Waite Deck" },
];

const CardInput = ({ selectedSpread, onCardChange, onDeckChange }) => {
  const [selectedDeck, setSelectedDeck] = useState(decks[0].value);
  const [cardSelections, setCardSelections] = useState<CardType[]>(
    Array(selectedSpread.numberOfCards).fill({ cardName: "", orientation: "upright" })
  );
  const [availableCards, setAvailableCards] = useState(deckCardsMapping[selectedDeck]);

  useEffect(() => {
    setAvailableCards(deckCardsMapping[selectedDeck]);
    setCardSelections(Array(selectedSpread.numberOfCards).fill({ cardName: "", orientation: "upright" }));
  }, [selectedDeck, selectedSpread]);

  useEffect(() => {
    onCardChange(cardSelections);
  }, [cardSelections, onCardChange]);

  const handleDeckChange = (deckValue) => {
    setSelectedDeck(deckValue);
    onDeckChange(decks.find((deck) => deck.value === deckValue));
  };

  const handleCardChange = (index, cardValue) => {
    const newSelections = [...cardSelections];
    newSelections[index] = { ...newSelections[index], cardName: cardValue };
    // newSelections[index] = { ...newSelections[index], cardName: cardValue };
    setCardSelections(newSelections);
  };

  const handleOrientationChange = (index) => {
    const newSelections = [...cardSelections];
    newSelections[index] = {
      ...newSelections[index],
      orientation: newSelections[index].orientation === "upright" ? "reversed" : "upright",
    };
    setCardSelections(newSelections);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Label>Choose a deck</Label>
        <Select onValueChange={handleDeckChange} value={selectedDeck}>
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

      {cardSelections.map((selection, index) => (
        <div key={index} className="mb-4">
          <Label>Card {index + 1}</Label>
          <Select onValueChange={(value) => handleCardChange(index, value)} value={selection.cardName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select card" />
            </SelectTrigger>
            <SelectContent
              onKeyUp={(e) => e.stopPropagation()}
              ref={(ref) => ref?.addEventListener("touchend", (e) => e.preventDefault())}
              className="z-50"
            >
              <SelectGroup>
                <SelectLabel>Cards</SelectLabel>
                {availableCards.map((card) => (
                  <SelectItem key={card} value={card}>
                    {card.cardName || card}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="mt-2 flex items-center">
            <Label className="mr-2">Reversed</Label>
            <Switch
              checked={selection.orientation === "reversed"}
              onCheckedChange={() => handleOrientationChange(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardInput;

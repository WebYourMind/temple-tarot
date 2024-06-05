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
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";
import { CardType } from "lib/types";
import { useTarotSession } from "lib/contexts/tarot-session-context";

const decks = [
  { value: "custom", name: "Toth 2.0 Deck", promptName: "Toth 2.0 deck (see card definitions for interpretations)" },
  { value: "thoth", name: "Thoth Deck", promptName: "Thoth Deck by Aleister Crowley" },
  { value: "ryder_waite", name: "Ryder Waite Deck", promptName: "Ryder Waite Deck" },
];

const CardInput = () => {
  const { spreadType, setSelectedCards, selectedDeck, setSelectedDeck } = useTarotSession();
  // const [selectedDeck, setSelectedDeck] = useState(decks[0].value);
  const [cardSelections, setCardSelections] = useState<CardType[]>(
    Array(spreadType.numberOfCards).fill({ cardName: "", orientation: "upright" })
  );
  const [availableCards, setAvailableCards] = useState(deckCardsMapping[selectedDeck.value]);

  useEffect(() => {
    setAvailableCards(deckCardsMapping[selectedDeck.value]);
    setCardSelections(Array(spreadType.numberOfCards).fill({ cardName: "", orientation: "upright" }));
  }, [selectedDeck, spreadType]);

  useEffect(() => {
    setSelectedCards(cardSelections);
  }, [cardSelections, setSelectedCards]);

  const handleDeckChange = (deckValue) => {
    setSelectedDeck(deckValue);
    setSelectedDeck(decks.find((deck) => deck.value === deckValue));
  };

  const handleCardChange = (index, cardValue) => {
    const newSelections = [...cardSelections];

    // if from custom deck
    if (cardValue.cardName) {
      newSelections[index] = { ...newSelections[index], ...cardValue };
    } else {
      newSelections[index] = { ...newSelections[index], cardName: cardValue };
    }
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
                  <SelectItem key={card.cardName || card} value={card.cardName || card}>
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

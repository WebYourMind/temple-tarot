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

const CardInput = () => {
  const { spreadType, setSelectedCards, selectedDeck } = useTarotSession();
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
    <div className="container mx-auto">
      {cardSelections.map((selection, index) => (
        <div key={index} className="mb-4">
          <Label className="mb-2">Card {index + 1}</Label>
          <Select onValueChange={(value) => handleCardChange(index, value)} value={selection.cardName}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder="Select card" />
            </SelectTrigger>
            <SelectContent
              onKeyUp={(e) => e.stopPropagation()}
              ref={(ref) => ref?.addEventListener("touchend", (e) => e.preventDefault())}
              className="z-50"
            >
              <SelectGroup>
                <SelectLabel className="text-center">Cards</SelectLabel>
                {availableCards.map((card) => (
                  <SelectItem
                    className={"cursor-pointer bg-background md:hover:underline"}
                    key={card.cardName || card}
                    value={card.cardName || card}
                  >
                    {card.cardName || card}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="mt-4 flex items-center">
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

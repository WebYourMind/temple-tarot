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
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { CardInReading } from "lib/types";

const CardInput = () => {
  const { spread, setSelectedCards, selectedDeck } = useTarotSession();
  const [cardSelections, setCardSelections] = useState<CardInReading[]>(
    Array(spread.numberOfCards).fill({ cardName: "", orientation: "upright" })
  );
  const [availableCards, setAvailableCards] = useState(deckCardsMapping[selectedDeck.value]);

  useEffect(() => {
    setAvailableCards(deckCardsMapping[selectedDeck.value]);
    setCardSelections(Array(spread.numberOfCards).fill({ cardName: "", orientation: "upright" }));
  }, [selectedDeck, spread]);

  useEffect(() => {
    setSelectedCards(cardSelections);
  }, [cardSelections, setSelectedCards]);

  const handleCardChange = (index, cardValue) => {
    const newSelections = [...cardSelections];

    // if from deck with images
    if (selectedDeck.value === "thoth_2" || selectedDeck.value === "ryder_waite") {
      const fullCard = deckCardsMapping[selectedDeck.value].find((fc) => fc.cardName === cardValue);
      newSelections[index] = { ...newSelections[index], ...fullCard, deck: selectedDeck.value };
    } else {
      newSelections[index] = { ...newSelections[index], cardName: cardValue, deck: selectedDeck.value };
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
    <div className="w-full border-t p-4">
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

          <div className="mb-6 mt-2 flex w-full items-center ">
            <Label className="mr-2">Upright</Label>
            <Switch
              checked={selection.orientation === "reversed"}
              onCheckedChange={() => handleOrientationChange(index)}
            />
            <Label className="ml-2">Reversed</Label>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardInput;

import { useState, useEffect } from "react";
import { customDeck } from "../tarot-deck";
import "../cards.css";
import OrientationPicker from "./orientation-picker";
import SplitDeck from "./split-deck";
import { CardType } from "lib/types";

interface CardSelectionProps {
  onSelect: (finalCard: CardType) => void;
  currentStep: number;
  query: string;
}

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const createShuffledDeck = () => {
  return shuffleArray(
    customDeck.map((card) => ({
      cardName: card.cardName,
      suit: card.suit,
      imageUrl: card.imageUrl,
      detail: card.detail,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect, query, currentStep }: CardSelectionProps) => {
  const [deck, setDeck] = useState<CardType[]>(createShuffledDeck());
  const [leftDeck, setLeftDeck] = useState<CardType[]>([]);
  const [rightDeck, setRightDeck] = useState<CardType[]>([]);
  const [finalCard, setFinalCard] = useState<CardType>();

  useEffect(() => {
    resetSelection(); // Reset to initial state on component mount
  }, [currentStep]);

  const resetSelection = () => {
    const shuffledDeck = deck;
    console.log({ shuffledDeck });
    const midPoint = Math.ceil(shuffledDeck.length / 2);
    setLeftDeck(shuffledDeck.slice(0, midPoint));
    setRightDeck(shuffledDeck.slice(midPoint));
    setFinalCard(null);
  };

  useEffect(() => {
    const shuffledDeck = deck;
    const midPoint = Math.ceil(shuffledDeck.length / 2);
    setLeftDeck(shuffledDeck.slice(0, midPoint));
    setRightDeck(shuffledDeck.slice(midPoint));
  }, []);

  const onFinalCard = (card) => {
    setFinalCard(card);
  };

  const switchOrientation = () => {
    setFinalCard({ ...finalCard, orientation: finalCard.orientation === "upright" ? "reversed" : "upright" });
  };

  const handleSelectHalf = (half: "left" | "right") => {
    // Determine the selected deck based on the user's choice.
    let selectedDeck = half === "left" ? [...leftDeck] : [...rightDeck];

    // If the selected deck has only one card, it's the final selection.
    if (selectedDeck.length === 1) {
      // onSelect(selectedDeck[0].name, selectedDeck[0].orientation); // Call onSelect with the final card.
      const chosenCard = selectedDeck[0];
      const deckMinusCard = deck.filter((card) => card.cardName !== chosenCard.cardName);
      console.log("chosen card:", chosenCard);
      console.log("deck without card:", deckMinusCard);
      setDeck(deckMinusCard);
      console.log(selectedDeck[0]);
      onFinalCard(selectedDeck[0]);
      return;
    }

    // Split the selected deck into new halves.
    const midPoint = Math.ceil(selectedDeck.length / 2);
    const newLeftDeck = selectedDeck.slice(0, midPoint); // First half becomes the new left deck.
    const newRightDeck = selectedDeck.slice(midPoint); // Second half becomes the new right deck.

    // Update the state with the new decks.
    setLeftDeck(newLeftDeck);
    setRightDeck(newRightDeck);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center pb-10 transition-opacity">
      {query && <p className="mx-10 mb-4 text-center italic">{query}</p>}
      {finalCard ? (
        <OrientationPicker switchOrientation={switchOrientation} finalCard={finalCard} onSubmit={onSelect} />
      ) : (
        <SplitDeck
          leftDeck={leftDeck}
          rightDeck={rightDeck}
          handleSelectHalf={handleSelectHalf}
          currentStep={currentStep}
        />
      )}
    </div>
  );
};

export default CardSelection;

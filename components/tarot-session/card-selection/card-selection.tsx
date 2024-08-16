"use client";
import { useState, useEffect } from "react";
import { thoth2, deckCardsMapping } from "lib/tarot-data/tarot-deck";
import "styles/cards.css";
import OrientationPicker from "./orientation-picker";
import SplitDeck from "./split-deck";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { CardInReading } from "lib/database/cardsInReadings.database";

interface CardSelectionProps {
  onSelect: (finalCard: CardInReading) => void;
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

const createShuffledDeck = (selectedDeck) => {
  return shuffleArray(
    deckCardsMapping[selectedDeck.value].map((card) => ({
      cardName: card.cardName || card,
      suit: card.suit,
      imageUrl: card.imageUrl,
      detail: card.detail,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect, query, currentStep }: CardSelectionProps) => {
  const { selectedDeck } = useTarotSession();
  const [deck, setDeck] = useState<CardInReading[]>();
  const [leftDeck, setLeftDeck] = useState<CardInReading[]>([]);
  const [rightDeck, setRightDeck] = useState<CardInReading[]>([]);
  const [finalCard, setFinalCard] = useState<CardInReading>();

  useEffect(() => {
    const shuffledDeck = createShuffledDeck(selectedDeck);
    setDeck(shuffledDeck);
    resetSelection(shuffledDeck);
  }, []);

  useEffect(() => {
    resetSelection(); // Reset to initial state on component mount
  }, [currentStep]);

  const resetSelection = (shuffledDeck = undefined) => {
    const toSplit = shuffledDeck || deck;
    if (toSplit) {
      const midPoint = Math.ceil(toSplit.length / 2);
      setLeftDeck(toSplit.slice(0, midPoint));
      setRightDeck(toSplit.slice(midPoint));
      setFinalCard(null);
    }
  };

  const onFinalCard = (card) => {
    setFinalCard(card);
  };

  const switchOrientation = () => {
    setFinalCard({ ...finalCard, orientation: finalCard.orientation === "upright" ? "reversed" : "upright" });
  };

  const handleSelectHalf = (half: "left" | "right") => {
    let selectedDeck = half === "left" ? [...leftDeck] : [...rightDeck];

    if (selectedDeck.length === 1) {
      const chosenCard = selectedDeck[0];
      const deckMinusCard = deck.filter((card) => card.cardName !== chosenCard.cardName);
      setDeck(deckMinusCard);
      onFinalCard(selectedDeck[0]);
      return;
    }

    const midPoint = Math.ceil(selectedDeck.length / 2);
    const newLeftDeck = selectedDeck.slice(0, midPoint);
    const newRightDeck = selectedDeck.slice(midPoint);

    setLeftDeck(newLeftDeck);
    setRightDeck(newRightDeck);
  };

  return (
    <div className="flex grow flex-col items-center justify-center pb-10 transition-opacity md:mx-auto">
      {query && <p className="mx-10 mb-4 text-center italic">{query}</p>}
      {finalCard ? (
        <OrientationPicker switchOrientation={switchOrientation} finalCard={finalCard} onSubmit={onSelect} />
      ) : (
        leftDeck &&
        rightDeck && (
          <SplitDeck
            leftDeck={leftDeck}
            rightDeck={rightDeck}
            handleSelectHalf={handleSelectHalf}
            currentStep={currentStep}
          />
        )
      )}
    </div>
  );
};

export default CardSelection;

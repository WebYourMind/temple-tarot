import { useState, useEffect } from "react";
import Image from "next/image";
import { tarotDeck } from "./tarot-deck";
import ThothCard from "../../../thoth-card.png";

interface CardSelectionProps {
  onSelect: (cardName: string, orientation: "upright" | "reversed") => void; // Callback to parent component
}

// Utility function to shuffle array
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

// Utility to create shuffled deck with orientations
const createShuffledDeck = () => {
  return shuffleArray(
    tarotDeck.map((card) => ({
      name: card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect }: CardSelectionProps) => {
  const [deck, setDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);

  useEffect(() => {
    setDeck(createShuffledDeck()); // Initialize with the full shuffled deck
  }, []);

  const handleSelectHalf = (half: "left" | "right") => {
    const midPoint = Math.ceil(deck.length / 2);
    const newDeck = half === "left" ? deck.slice(0, midPoint) : deck.slice(midPoint);
    setDeck(newDeck);

    if (newDeck.length === 1) {
      onSelect(newDeck[0].name, newDeck[0].orientation);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {deck.length > 1 && (
        <>
          <p className="text-center">The deck is split.</p>
          <p className="mb-4 text-center">Where is your card?</p>
          <div className="flex w-full justify-between">
            {["left", "right"].map((side, index) => (
              <div key={side} className="flex flex-col items-center">
                <Image
                  onClick={() => handleSelectHalf(side as "left" | "right")}
                  className="cursor-pointer"
                  src={ThothCard}
                  alt={side}
                  width={200} // Adjust based on your layout
                  height={350} // Adjust to maintain aspect ratio
                />
                <p className="mt-2">{side.charAt(0).toUpperCase() + side.slice(1)}</p>
                <p>{index === 0 ? Math.ceil(deck.length / 2) : Math.floor(deck.length / 2)} Cards</p>
              </div>
            ))}
          </div>
        </>
      )}
      {deck.length === 1 && (
        <>
          <div className="flex h-full w-full flex-col items-center">
            <Image src={ThothCard} alt="Your card" width={200} height={350} />
          </div>
          <div className="mt-4">
            <p>
              Your card is: <strong>{deck[0].name}</strong> and it's <strong>{deck[0].orientation}</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSelection;

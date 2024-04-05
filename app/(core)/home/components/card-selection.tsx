import { useState, useEffect } from "react";
import Image from "next/image";
import { tarotDeck } from "./tarot-deck";
import ThothCard from "../../../thoth-card.png";
import "./cards.css";

interface CardSelectionProps {
  onSelect: (cardName: string, orientation: "upright" | "reversed") => void;
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
    tarotDeck.map((card) => ({
      name: card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect }: CardSelectionProps) => {
  const [deck, setDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [glowEffect, setGlowEffect] = useState("");

  useEffect(() => {
    setDeck(createShuffledDeck());
  }, []);

  const handleSelectHalf = (half: "left" | "right") => {
    setGlowEffect(half); // Trigger glow effect
    const midPoint = Math.ceil(deck.length / 2);
    const newDeck = half === "left" ? deck.slice(0, midPoint) : deck.slice(midPoint);
    console.log("Chosen deck:", newDeck);
    setDeck(newDeck);

    if (newDeck.length === 1) {
      onSelect(newDeck[0].name, newDeck[0].orientation);
    }

    setTimeout(() => {
      setGlowEffect(""); // Remove glow effect after it's shown
    }, 1000); // Duration of the glow effect
  };

  return (
    <div className="flex flex-col items-center justify-center transition-opacity md:p-4">
      {deck.length > 1 && (
        <>
          <p className="text-center">The deck is split.</p>
          <p className="mb-4 text-center">Where is your card?</p>
          <div className="flex w-full justify-between">
            {["left", "right"].map((side) => (
              <div key={side} className={`flex flex-col items-center space-y-2 px-1`}>
                <p className="mt-2">{side.charAt(0).toUpperCase() + side.slice(1)} deck</p>
                <Image
                  onClick={() => handleSelectHalf(side as "left" | "right")}
                  className={`hover:glow-on-click cursor-pointer transition md:hover:scale-105 md:hover:brightness-125 ${
                    glowEffect === side ? "glow-on-click" : ""
                  }`}
                  src={ThothCard}
                  alt={side}
                  width={200}
                  height={350}
                />
                {/* <p className="text-8xl">{side === "left" ? Math.ceil(deck.length / 2) : Math.floor(deck.length / 2)}</p> */}
                <p>{side === "left" ? Math.ceil(deck.length / 2) : Math.floor(deck.length / 2)} Cards</p>
              </div>
            ))}
          </div>
        </>
      )}
      {deck.length === 1 && (
        <div className="mt-4">
          <p>
            Your card is: <strong>{deck[0].name}</strong> and it's <strong>{deck[0].orientation}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardSelection;

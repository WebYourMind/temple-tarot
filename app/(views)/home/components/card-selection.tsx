import { useState, useEffect } from "react";
import Image from "next/image";
import { tarotDeck } from "./tarot-deck";
import ThothCard from "../../../thoth-card.png";
import "./cards.css";

interface CardSelectionProps {
  onSelect: (cardName: string, orientation: "upright" | "reversed") => void;
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
    tarotDeck.map((card) => ({
      name: card,
      orientation: Math.random() > 0.5 ? "upright" : "reversed",
    }))
  );
};

const CardSelection = ({ onSelect, query }: CardSelectionProps) => {
  // const [deck, setDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [leftDeck, setLeftDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [rightDeck, setRightDeck] = useState<{ name: string; orientation: "upright" | "reversed" }[]>([]);
  const [glowEffect, setGlowEffect] = useState("");

  useEffect(() => {
    const shuffledDeck = createShuffledDeck();
    console.log({ shuffledDeck });
    // setDeck(createShuffledDeck());
    const midPoint = Math.ceil(shuffledDeck.length / 2);
    setLeftDeck(shuffledDeck.slice(0, midPoint));
    setRightDeck(shuffledDeck.slice(midPoint));
  }, []);

  const handleSelectHalf = (half: "left" | "right") => {
    // Determine the selected deck based on the user's choice.
    let selectedDeck = half === "left" ? [...leftDeck] : [...rightDeck];

    // If the selected deck has only one card, it's the final selection.
    if (selectedDeck.length === 1) {
      console.log("onSelect");
      onSelect(selectedDeck[0].name, selectedDeck[0].orientation); // Call onSelect with the final card.
      return;
    }

    // Split the selected deck into new halves.
    const midPoint = Math.ceil(selectedDeck.length / 2);
    const newLeftDeck = selectedDeck.slice(0, midPoint); // First half becomes the new left deck.
    const newRightDeck = selectedDeck.slice(midPoint); // Second half becomes the new right deck.

    console.log(newLeftDeck);
    console.log(newRightDeck);
    // Update the state with the new decks.
    setLeftDeck(newLeftDeck);
    setRightDeck(newRightDeck);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center transition-opacity">
      <p className="mb-4 max-w-xs text-center text-xl">Focus on your question and choose the deck that calls to you.</p>
      <p className="mx-10 mb-10 text-center italic">{query}</p>
      <div className="flex w-full justify-between">
        {["left", "right"].map((side) => (
          <div key={side} className="mx-md:mx-2">
            <button
              // @ts-ignore
              onClick={() => handleSelectHalf(side)}
              className="relative flex h-[200px] w-[150px] flex-col items-center rounded-lg p-4 transition-all hover:scale-105 md:h-[350px] md:w-[300px]"
            >
              {(side === "left" ? leftDeck : rightDeck).map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  className="absolute top-0 md:top-8"
                  style={{
                    transform: `translate(${-leftDeck.length / 2 + cardIndex + 1}px, ${
                      -leftDeck.length / 2 + cardIndex + 1
                    }px)`, // `rotate(${(Math.floor(Math.random() * 6 - 3) + 1) * 2 - 2}deg)`,
                    zIndex: cardIndex,
                  }}
                >
                  <Image
                    src={ThothCard}
                    alt={`${cardIndex + 1}: ${card.name} ${card.orientation}`}
                    width={200}
                    height={350}
                    className="scale-50 rounded-lg shadow-lg md:scale-100"
                  />
                </div>
              ))}
              {/* <div className="h-[150px] md:h-[300px]" /> */}
              {/* <span>Choose {side.charAt(0).toUpperCase() + side.slice(1)} Deck</span> */}
            </button>
            <p className="mt-5 text-center">{side.charAt(0).toUpperCase() + side.slice(1)} Deck</p>
            <p className="text-center">{side === "left" ? leftDeck.length : rightDeck.length} Cards</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSelection;
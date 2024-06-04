"use client";

import { useEffect, useState } from "react";
import TarotCard from "./tarot-card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "lib/utils";

function SplitDeck({ leftDeck, rightDeck, handleSelectHalf, currentStep }) {
  const [selectedSide, setSelectedSide] = useState(null);
  const [allLoaded, setAllLoaded] = useState(currentStep > 0);
  const [loadStatus, setLoadStatus] = useState(new Array(leftDeck.length + rightDeck.length).fill(false));

  useEffect(() => {
    if (loadStatus.every((status) => status === true)) {
      setAllLoaded(true);
    }
  }, [loadStatus]);

  const handleImageLoad = (index) => {
    const newLoadStatus = [...loadStatus];
    newLoadStatus[index] = true;
    setLoadStatus(newLoadStatus);
  };

  const handleDeckSelect = (side) => {
    if ((side === "left" && leftDeck.length === 1) || (side === "right" && rightDeck.length === 1)) {
      handleSelectHalf(side);
    } else {
      setSelectedSide(side);
      setTimeout(() => {
        handleSelectHalf(side);
        setSelectedSide(null);
      }, 700);
    }
  };
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <p className={cn("mb-8 max-w-xs text-center font-sans text-xl md:mb-10")}>
        The deck is split.
        <br />
        Where is your card?
      </p>
      <div
        className={`flex w-full justify-between transition-opacity duration-700 ${
          allLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {["left", "right"].map((side) => (
          <div
            key={side}
            className={`transition duration-300 md:mx-2 ${selectedSide && selectedSide !== side ? "opacity-0" : ""}`}
          >
            <div className="flex w-full justify-center">
              {side === "left" ? (
                <ArrowLeft className="pulse-1 opacity-90" size={25} />
              ) : (
                <ArrowRight className="pulse-2 opacity-90" size={25} />
              )}
            </div>
            <button
              onClick={() => handleDeckSelect(side)}
              className={cn(
                "relative flex h-[250px] w-[170px] scale-75 cursor-default flex-col items-center rounded-lg transition-all duration-500 fade-in md:h-[370px] md:w-[300px] md:scale-100 md:p-0",
                selectedSide && selectedSide !== side ? "opacity-0" : ""
              )}
            >
              {(side === "left" ? leftDeck : rightDeck).map((card, cardIndex) => {
                const isSideSelected = selectedSide === side;
                const isBottomHalf = cardIndex < (leftDeck.length - 1) / 2;
                const defaultPosition = -leftDeck.length / 2 + cardIndex + 1;
                const distance = isMobile ? 50 : 100;

                const startFade = !isBottomHalf && isSideSelected;

                const translate = `translate(${
                  (isSideSelected ? (isBottomHalf ? -distance : distance) : 0) + (isMobile ? 0 : defaultPosition)
                }px, ${defaultPosition}px)`;
                return (
                  <div
                    key={cardIndex}
                    className={cn(`absolute top-0 cursor-pointer transition ease-in-out md:top-8`)}
                    style={{
                      transform: translate,
                      zIndex: cardIndex,
                    }}
                  >
                    <div className={cn("transition delay-300", startFade && "opacity-0")}>
                      <TarotCard
                        alt={`${cardIndex + 1}: ${card.cardName} ${card.orientation}`}
                        onLoad={() => handleImageLoad(cardIndex + (side === "left" ? 0 : leftDeck.length))}
                      />
                    </div>
                  </div>
                );
              })}
            </button>
            <p className={cn("text-center font-sans md:mt-5")}>{side.charAt(0).toUpperCase() + side.slice(1)} Half</p>
            <p className={cn("text-center font-sans")}>{side === "left" ? leftDeck.length : rightDeck.length} Cards</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default SplitDeck;

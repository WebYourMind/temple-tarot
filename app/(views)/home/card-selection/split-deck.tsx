"use client";

import { useEffect, useState } from "react";
import TarotCard from "./tarot-card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "lib/utils";
import { InfoButton } from "components/info-dialog";

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
        Where is your card?
        <InfoButton type="cards" />
      </p>
      <div
        className={`flex w-full grow justify-between transition-opacity duration-700 ${
          allLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {["left", "right"].map((side) => (
          <div
            key={side}
            className={`flex h-full grow flex-col items-center transition duration-300 md:mx-auto ${
              selectedSide && selectedSide !== side ? "opacity-0" : ""
            }`}
          >
            <div className="mb-4 flex w-full justify-center">
              {side === "left" ? (
                <ArrowLeft className="pulse-1 opacity-90" size={25} />
              ) : (
                <ArrowRight className="pulse-2 opacity-90" size={25} />
              )}
            </div>
            <button
              onClick={() => handleDeckSelect(side)}
              className={cn(
                "relative h-[200px] w-full max-w-[220px] cursor-default transition-all duration-500 fade-in md:h-[330px] md:w-[400px] md:max-w-xs md:p-0",
                selectedSide && selectedSide !== side ? "opacity-0" : ""
              )}
            >
              {(side === "left" ? leftDeck : rightDeck).map((card, cardIndex) => {
                const isSideSelected = selectedSide === side;
                const isBottomHalf = cardIndex < (leftDeck.length - 1) / 2;
                const defaultPosition = -leftDeck.length / 2 + cardIndex / 2;
                const distance = isMobile ? 50 : 100;

                const startFade = !isBottomHalf && isSideSelected;

                const translate = `translate(calc(${
                  (isSideSelected ? (isBottomHalf ? -distance : distance) : 0) + (isMobile ? 0 : defaultPosition)
                }px - 50%), calc(${defaultPosition}px - 50%))`;
                return (
                  <div
                    key={cardIndex}
                    className={cn(`absolute left-1/2 top-1/2 cursor-pointer transition ease-in-out`)}
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
            <p className={cn("my-0 text-center font-sans md:mt-5")}>
              {side.charAt(0).toUpperCase() + side.slice(1)} Half
            </p>
            <p className={cn("my-0 text-center font-sans")}>
              {side === "left" ? leftDeck.length : rightDeck.length} Cards
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default SplitDeck;

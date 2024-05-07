"use client";

import { useEffect, useState } from "react";
import TarotCard from "../tarot-card";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

function SplitDeck({ leftDeck, rightDeck, handleSelectHalf, currentStep }) {
  const [selectedSide, setSelectedSide] = useState(null);
  const [allLoaded, setAllLoaded] = useState(currentStep > 0);
  const [loadStatus, setLoadStatus] = useState(new Array(leftDeck.length + rightDeck.length).fill(false));

  useEffect(() => {
    // Check if all images are loaded
    if (loadStatus.every((status) => status === true)) {
      setAllLoaded(true);
    }
  }, [loadStatus]);

  const handleImageLoad = (index) => {
    // Update the load status for individual card
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
      }, 500);
    }
  };
  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <p className="max-w-xs text-center font-serif text-xl md:mb-10">
        The deck is split.
        <br />
        Where is your card?
      </p>
      {/* <div className="flex w-full justify-around">
        <ArrowBigLeft className="pulse-1" size={35} />
        <ArrowBigRight className="pulse-2" size={35} />
      </div> */}
      {/* <ArrowBigLeft /> */}
      <div
        className={`flex w-full justify-between transition-opacity duration-700 ${
          allLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {["left", "right"].map((side) => (
          <div
            key={side}
            className={`transition fade-in-0 md:mx-2 ${selectedSide && selectedSide !== side ? "opacity-0" : ""}`}
          >
            <div className="pulse flex w-full justify-center">
              {side === "left" ? (
                <ArrowBigLeft className="pulse-1" size={35} />
              ) : (
                <ArrowBigRight className="pulse-2" size={35} />
              )}
            </div>
            <button
              onClick={() => handleDeckSelect(side)}
              className="relative flex h-[250px] w-[170px] scale-75 cursor-default flex-col items-center rounded-lg transition-all duration-500 md:h-[370px] md:w-[300px] md:scale-100 md:p-0"
            >
              {(side === "left" ? leftDeck : rightDeck).map((card, cardIndex) => {
                const isSideSelected = selectedSide === side;
                const isBottomHalf = cardIndex < (leftDeck.length - 1) / 2;
                const defaultPosition = -leftDeck.length / 2 + cardIndex + 1;

                const translate = `translate(${
                  (isSideSelected ? (isBottomHalf ? -100 : 100) : 0) + (isMobile ? 0 : defaultPosition)
                }px, ${defaultPosition}px)`;
                return (
                  <div
                    key={cardIndex}
                    className={`absolute top-0 cursor-pointer transition fade-in-0 fade-out-0 md:top-8`}
                    style={{
                      transform: translate,
                      zIndex: cardIndex,
                    }}
                  >
                    <TarotCard
                      alt={`${cardIndex + 1}: ${card.name} ${card.orientation}`}
                      onLoad={() => handleImageLoad(cardIndex + (side === "left" ? 0 : leftDeck.length))}
                    />
                  </div>
                );
              })}
            </button>
            <p className="text-center font-serif md:mt-5">{side.charAt(0).toUpperCase() + side.slice(1)} Half</p>
            <p className="text-center font-serif">{side === "left" ? leftDeck.length : rightDeck.length} Cards</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default SplitDeck;

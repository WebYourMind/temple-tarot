"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "lib/utils";
import Markdown from "react-markdown";
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";

interface Card {
  cardName: string;
  orientation: string;
}

interface Deck {
  value: string;
}

interface InterpretationSlideProps {
  cards: Card[];
  selectedDeck: Deck;
  aiResponse: string;
  query?: string;
}

const InterpretationSlide: React.FC<InterpretationSlideProps> = ({ cards, selectedDeck, aiResponse, query }) => {
  const [open, setOpen] = useState(false);
  const [focusedCard, setFocusedCard] = useState<any>(null);

  return (
    <div className="flex h-full w-full flex-col text-center">
      <div className="absolute bottom-0 top-0 w-full overflow-scroll py-4">
        {query && <p className="mb-8 mr-1 text-left font-bold italic">{query || "Open Reading"}</p>}
        <div className="flex w-full justify-around space-x-4">
          {cards?.length > 0 &&
            cards.map((card) => {
              let cardWithImage;
              if (selectedDeck.value === "custom") {
                cardWithImage = deckCardsMapping[selectedDeck.value].find(
                  (fullCard) => fullCard.cardName === card.cardName
                );
              }
              return (
                <div className="mb-8" key={card.cardName}>
                  {cardWithImage?.imageUrl && (
                    <Image
                      onClick={() => {
                        setFocusedCard(cardWithImage);
                        setOpen(true);
                      }}
                      alt={cardWithImage.cardName}
                      src={cardWithImage.imageUrl}
                      width={256}
                      height={384}
                      className={cn(
                        `mx-auto ${cards.length > 1 ? "max-h-[20vh]" : "max-h-44"} w-auto rounded-lg`,
                        (card.orientation === "reversed" || card.orientation === "Reversed") && "rotate-180"
                      )}
                    />
                  )}
                </div>
              );
            })}
        </div>
        <Markdown className="prose prose-indigo text-start font-sans text-base leading-relaxed tracking-wide">
          {aiResponse}
        </Markdown>
      </div>
      {/* Optionally include a modal or popover to display focused card details */}
      {/* <CardInfo card={focusedCard} open={open} onOpenChange={() => setOpen(!open)} /> */}
    </div>
  );
};

export default InterpretationSlide;

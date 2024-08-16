"use client";

import Loading from "components/loading";
import { deckCardsMapping } from "lib/tarot-data/tarot-deck";
import { cn, findFullCardInDeck } from "lib/utils";
import Image from "next/image";
import "styles/cards.css";

function ReadingLoading({ cards, deckType }) {
  if (!cards) return <Loading />;

  return (
    <div className="flex h-full grow flex-col items-center justify-center space-y-10">
      <div className="flex flex-wrap justify-center gap-4">
        {cards?.map((card) => {
          const cardWithImage = findFullCardInDeck(card.cardName, deckType);
          return (
            <div
              key={card.cardName}
              className={`flex max-w-[${100 / cards.length}%] flex-col justify-center text-center`}
            >
              {cardWithImage?.imageUrl && (
                <Image
                  key={cardWithImage.cardName}
                  alt={cardWithImage.cardName}
                  src={cardWithImage.imageUrl}
                  width={256}
                  height={384}
                  className={cn(
                    `mx-auto ${cards.length > 1 ? "max-h-[20vh]" : "max-h-[30vh]"} w-auto rounded`,
                    (card.orientation === "reversed" || card.orientation === "Reversed") && "rotate-180"
                  )}
                />
              )}
              <p className="mb-0">{card.cardName}</p>
              <p className="mt-0">({card.orientation})</p>
            </div>
          );
        })}
      </div>
      <p>Reading your card{cards.length > 1 ? "s" : ""}...</p>
    </div>
  );
}

export default ReadingLoading;

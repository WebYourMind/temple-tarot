"use client";

import { useState } from "react";
import Image from "next/image";
import { thoth2 } from "../../../lib/tarot-data/tarot-deck";
import CardInfo from "./card-info";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-flow/query/query-input";

const suits = ["Major Arcana", "Air", "Water", "Earth", "Fire"];

export default function Page() {
  const [selectedCard, setSelectedCard] = useState(null);

  const renderSuit = (suit, suitCards, prevCardsLength) => (
    <div key={suit}>
      <h2 className="mb-8 mt-16 text-2xl font-bold">{suit}</h2>
      <div className="grid grid-cols-3 gap-2 gap-y-10 md:grid-cols-5 lg:grid-cols-7">
        {suitCards.map((card, index) => (
          <div
            key={card.cardName}
            className="flex cursor-pointer flex-col justify-between"
            onClick={() => setSelectedCard(card)}
          >
            <Image alt={card.cardName} src={card.imageUrl} width={1024} height={1536} />
            <p className="mb-0 text-center font-bold">{card.cardName}</p>
            <p className="mt-0 text-center text-xs font-bold">({prevCardsLength - suitCards.length + index + 1})</p>
          </div>
        ))}
      </div>
    </div>
  );

  let prevCardsLength = 0;

  return (
    <div className={cn("relative mx-auto p-4 md:max-w-6xl", MagicFont.className)}>
      <h1 className="my-8">Thoth 2.0 Glossary</h1>
      {suits.map((suit) => {
        const suitCards = thoth2.filter((card) => card.suit === suit);
        prevCardsLength += suitCards.length;
        return renderSuit(suit, suitCards, prevCardsLength);
      })}

      <CardInfo card={selectedCard} open={!!selectedCard} onOpenChange={() => setSelectedCard(null)} />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { customDeck } from "../../../lib/tarot-data/tarot-deck";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogContent } from "components/ui/dialog";

const suits = ["Major Arcana", "Air", "Water", "Earth", "Fire"];

export const CardDialog = ({ card, open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <DialogContent className="fixed left-1/2 top-1/2 grid max-h-[90vh] w-[90%] -translate-x-1/2 -translate-y-1/2 transform grid-cols-2 overflow-scroll rounded-lg bg-background p-4 shadow-lg md:max-w-2xl md:p-6">
          <div className="col-span-2 mt-6 w-full items-center md:col-span-1 md:mt-0">
            <Image
              alt={card?.cardName}
              src={card?.imageUrl}
              width={256}
              height={384}
              className="h-auto w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="col-span-2 flex flex-col justify-between md:col-span-1">
            <div>
              <Dialog.Title className="mt-0 text-3xl font-bold">{card?.cardName}</Dialog.Title>
              <Dialog.Description className="text-lg">{card?.suit}</Dialog.Description>
              <div className="space-y-6">
                <div>
                  <p className="text-xl font-semibold">Summary</p>
                  <p>{card?.detail.paragraphSummary}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 self-end text-right">
              <Dialog.Close>Close</Dialog.Close>
            </div>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

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
    <div className="relative mx-auto p-4 md:max-w-6xl">
      <h1 className="my-8">Toth 2.0 Glossary</h1>
      {suits.map((suit, index) => {
        const suitCards = customDeck.filter((card) => card.suit === suit);
        prevCardsLength += suitCards.length;
        return renderSuit(suit, suitCards, prevCardsLength);
      })}

      <CardDialog card={selectedCard} open={!!selectedCard} onOpenChange={() => setSelectedCard(null)} />
    </div>
  );
}

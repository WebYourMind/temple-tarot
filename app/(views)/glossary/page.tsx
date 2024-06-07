"use client";

import { useState } from "react";
import Image from "next/image";
import { customDeck } from "../../../lib/tarot-data/tarot-deck";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogContent } from "components/ui/dialog";

const suits = ["Major Arcana", "Air", "Water", "Earth", "Fire"];

export default function Page() {
  const [selectedCard, setSelectedCard] = useState(null);

  const renderSuit = (suit) => (
    <div key={suit}>
      <h2 className="mb-8 mt-16 text-2xl font-bold">{suit}</h2>
      <div className="grid grid-cols-1 gap-2 gap-y-10 md:grid-cols-5 lg:grid-cols-7">
        {customDeck
          .filter((card) => card.suit === suit)
          .map((card) => (
            <div
              key={card.cardName}
              className="flex cursor-pointer flex-col justify-between"
              onClick={() => setSelectedCard(card)}
            >
              <Image alt={card.cardName} src={card.imageUrl} width={1024} height={1536} />
              <p className="text-center font-bold">{card.cardName}</p>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="relative mx-auto p-4 md:max-w-6xl">
      <h1 className="my-8">Card Glossary</h1>
      {suits.map((suit) => renderSuit(suit))}

      <Dialog.Root open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <Dialog.Portal>
          <DialogContent className="fixed left-1/2 top-1/2 max-h-[90vh] w-[90%] -translate-x-1/2 -translate-y-1/2 transform overflow-scroll rounded-lg bg-background p-6 shadow-lg md:max-w-2xl">
            <Dialog.Title className="mb-4 text-center text-3xl font-bold">{selectedCard?.cardName}</Dialog.Title>
            <Dialog.Description className="mb-6 text-center text-lg">{selectedCard?.suit}</Dialog.Description>
            <div className="mb-6 flex flex-col items-center">
              <Image
                alt={selectedCard?.cardName}
                src={selectedCard?.imageUrl}
                width={256}
                height={384}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xl font-semibold">One Sentence Summary</p>
                <p>{selectedCard?.detail.oneSentenceSummary}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Paragraph Summary</p>
                <p>{selectedCard?.detail.paragraphSummary}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Role Description</p>
                <p>{selectedCard?.detail.roleDescription}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Reading Tips</p>
                <p>{selectedCard?.detail.readingTips}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Upright Guidance</p>
                <p>{selectedCard?.detail.uprightGuidance}</p>
              </div>
              <div>
                <p className="text-xl font-semibold">Reversed Guidance</p>
                <p>{selectedCard?.detail.reversedGuidance}</p>
              </div>
            </div>
            <div className="mt-6 text-right">
              <Dialog.Close>Close</Dialog.Close>
            </div>
          </DialogContent>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import SpreadSelection from "./spread-selection"; // Ensure correct import path
import CardSelection from "./card-selection"; // Assuming you'll create this
import QueryInput from "./query-input";
import { Button } from "components/ui/button";
import { Interpreter } from "./interpreter";
import { IconClose } from "components/ui/icons";
import CardSelectionWrapper from "./card-selection-wrapper";

export type SelectedCardType = {
  cardName: string;
  orientation: string;
};

export default function TarotSession() {
  const [query, setQuery] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<SelectedCardType[]>();
  const [spreadType, setSpreadType] = useState<any>(); // To store the selected spread type
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");

  function handleSubmitQuestion(question: string, spread) {
    setQuery(question);
    setSpreadType(spread);
    setPhase("cards");
  }

  function handleCardSelect(selectedCards) {
    setSelectedCards(selectedCards);
  }

  useEffect(() => {
    if (selectedCards && query) {
      setPhase("reading");
    }
  }, [selectedCards, query]);

  function handleReset() {
    setPhase("question");
    setSelectedCards(null);
    setQuery(null);
  }

  return (
    <div className="max-w-4xl p-4 pt-8 md:container">
      {phase === "question" && <QueryInput onSubmitQuestion={handleSubmitQuestion} />}
      {/* {phase === "spread" && <SpreadSelection onSpreadSelect={handleSpreadSelect} />} */}
      {phase === "cards" && (
        <CardSelectionWrapper onSelectComplete={handleCardSelect} query={query} spread={spreadType} />
      )}
      {phase === "reading" && query && selectedCards && (
        <>
          <Interpreter query={query} cards={selectedCards} spread={spreadType} />
          <div className="my-20 flex justify-center">
            <Button
              variant={"ghost"}
              className="flex h-14 w-14 items-center justify-center rounded-full font-mono hover:text-primary"
              onClick={handleReset}
            >
              <IconClose className="h-20 w-20" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

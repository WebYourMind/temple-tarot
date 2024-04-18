"use client";

import { useEffect, useState } from "react";
import SpreadSelection from "./spread-selection"; // Ensure correct import path
import CardSelection from "./card-selection"; // Assuming you'll create this
import QueryInput from "./query-input";
import { Button } from "components/ui/button";
import { Interpreter } from "./interpreter";
import { IconClose } from "components/ui/icons";

export default function TarotSession() {
  const [query, setQuery] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedOrientation, setSelectedOrientation] = useState<string | null>(null);
  const [spreadType, setSpreadType] = useState<string | null>(null); // To store the selected spread type
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");

  function handleSubmitQuestion(question: string) {
    setQuery(question);
    setPhase("spread");
  }

  function handleSpreadSelect(spread: string) {
    setSpreadType(spread);
    setPhase("cards");
  }

  function handleCardSelect(card: string, orientation: "upright" | "reversed") {
    setSelectedCard(card);
    setSelectedOrientation(orientation);
  }

  useEffect(() => {
    if (selectedCard && selectedOrientation && query) {
      setPhase("reading");
    }
  }, [selectedCard, selectedOrientation, query]);

  function handleReset() {
    setPhase("question");
    setSelectedCard(null);
    setSelectedOrientation(null);
    setQuery(null);
  }

  return (
    <div className="max-w-4xl p-4 pt-8 md:container">
      {phase === "question" && <QueryInput onSubmitQuestion={handleSubmitQuestion} />}
      {phase === "spread" && <SpreadSelection onSpreadSelect={handleSpreadSelect} />}
      {phase === "cards" && <CardSelection onSelect={handleCardSelect} query={query} />}
      {phase === "reading" && query && selectedCard && selectedOrientation && (
        <>
          <Interpreter query={query} card={selectedCard} orientation={selectedOrientation} />
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

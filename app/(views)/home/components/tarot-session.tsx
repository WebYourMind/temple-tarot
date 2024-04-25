"use client";

import { useEffect, useState } from "react";
import QueryInput from "./query-input";
import { Button } from "components/ui/button";
import { Interpreter } from "./interpreter";
import { IconClose } from "components/ui/icons";
import CardSelectionWrapper from "./card-selection-wrapper";
import { track } from "@vercel/analytics/react";
import { useSession } from "next-auth/react";

export type SelectedCardType = {
  cardName: string;
  orientation: string;
};

export default function TarotSession() {
  const [query, setQuery] = useState<string | null>(null);
  const [selectedCards, setSelectedCards] = useState<SelectedCardType[]>();
  const [spreadType, setSpreadType] = useState<any>(); // To store the selected spread type
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");
  const { data: session } = useSession() as { data: { user: { id: string } } };

  function handleSubmitQuestion(question = "", spread) {
    setQuery(question);
    setSpreadType(spread);
    setPhase("cards");
  }

  function handleCardSelect(selectedCards) {
    setSelectedCards(selectedCards);
  }

  useEffect(() => {
    if (selectedCards) {
      track("Reading", { spread: spreadType.value, userId: session?.user?.id });
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
      {phase === "reading" && selectedCards && (
        <>
          <Interpreter query={query} cards={selectedCards} spread={spreadType} />
          <div className="my-10 flex justify-center">
            <Button
              variant={"ghost"}
              className="flex h-14 w-14 items-center justify-center rounded-full hover:text-primary"
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

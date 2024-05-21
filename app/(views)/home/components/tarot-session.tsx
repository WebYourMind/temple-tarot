"use client";

import { useEffect, useState } from "react";
import QueryInput from "./query-input";
import { Interpreter } from "./interpreter";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import { track } from "@vercel/analytics/react";
import { useSession } from "next-auth/react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "components/ui/dialog";
import { Info } from "lucide-react";
import { infoMap } from "./info";
import InfoDialog from "./info-dialog";

export type SelectedCardType = {
  cardName: string;
  orientation: string;
};

export default function TarotSession() {
  const [query, setQuery] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [infoContent, setInfoContent] = useState(infoMap["question"]);
  const [phase, setPhase] = useState<"question" | "spread" | "cards" | "reading">("question");
  const [open, setOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState<SelectedCardType[]>();
  const [selectedDeck, setSelectedDeck] = useState({ promptName: "Thoth Deck by Aleister Crowley" });
  const [spreadType, setSpreadType] = useState<any>(); // To store the selected spread type
  const { data: session } = useSession() as { data: { user: { id: string } } };
  const [hasOwnCards, setHasOwnCards] = useState(false);

  function handleSubmitQuestion(question = "", spread) {
    setQuery(question);
    setSpreadType(spread);

    if (!hasOwnCards) {
      setPhase("cards");
      setInfoContent(infoMap["cards"]);
    } else {
      setPhase("reading");
      track("Reading", { spread: spread.value, userId: session?.user?.id });
      selectedCards.forEach((card) => {
        track("Cards", { cardName: card.cardName, orientation: card.orientation });
      });
    }
  }

  function handleCardSelect(selectedCards) {
    setSelectedCards(selectedCards);
  }

  function handleDeckChange(selectedDeck) {
    setSelectedDeck(selectedDeck);
  }

  useEffect(() => {
    if (selectedCards && phase === "cards") {
      setPhase("reading");
      track("Reading", { spread: spreadType.value, userId: session?.user?.id });
      selectedCards.forEach((card) => {
        track("Cards", { cardName: card.cardName, orientation: card.orientation });
      });
    }
  }, [selectedCards, query]);

  useEffect(() => {
    const phaseKey = `hasSeenInfo-${phase}`;
    const hasSeenInfo = localStorage.getItem(phaseKey);

    // If it's the user's first time in this phase, show the info dialog
    setInfoContent(infoMap[phase] || infoMap["question"]);
    if (!hasSeenInfo && (phase === "cards" || phase === "question")) {
      setShowInfo(true);
      localStorage.setItem(phaseKey, "true"); // Mark this phase as seen
    }
  }, [phase]);

  function handleReset() {
    setPhase("question");
    setSelectedCards(null);
    setQuery(null);
  }

  return (
    <div className="max-w-4xl p-4 fade-in md:container">
      <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
        <div className="flex w-full justify-end">
          <DialogTrigger className="opacity-50">
            <Info />
          </DialogTrigger>
        </div>
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
          {phase === "question" && (
            <QueryInput
              selectedCards={selectedCards}
              onSubmitQuestion={handleSubmitQuestion}
              closeDialog={() => setOpen(false)}
              onCardChange={handleCardSelect}
              onDeckChange={handleDeckChange}
              setHasOwnCards={setHasOwnCards}
            />
          )}
        </Dialog>
        {/* {phase === "spread" && <SpreadSelection onSpreadSelect={handleSpreadSelect} />} */}
        {phase === "cards" && (
          <CardSelectionWrapper onSelectComplete={handleCardSelect} query={query} spread={spreadType} />
        )}
        {phase === "reading" && selectedCards && (
          <Interpreter
            query={query}
            cards={selectedCards}
            spread={spreadType}
            handleReset={handleReset}
            selectedDeck={selectedDeck}
          />
        )}
        <InfoDialog closeDialog={() => setShowInfo(false)} infoContent={infoContent} />
      </Dialog>
    </div>
  );
}

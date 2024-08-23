"use client";

import { Dialog } from "@radix-ui/react-dialog";
import InfoDialog from "components/info-dialog";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import Interpreter from "./interpretation/interpreter";
import { FollowUpReadingInput, NewReadingInput } from "./query/query-input";
import { useEffect, useState } from "react";
import ReadingLoading from "./interpretation/reading-loading";

export default function TarotFlow() {
  const {
    phase,
    selectedCards,
    showInfo,
    setShowInfo,
    infoContent,
    isFollowUp,
    tarotSessionId,
    isPending,
    selectedDeck,
  } = useTarotFlow();
  const [showInterpreter, setShowInterpreter] = useState(false);

  useEffect(() => {
    if (phase === "reading" && isFollowUp) {
      setShowInterpreter(true);
    }
  }, [phase, isFollowUp, selectedCards]);

  return (
    <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
      {phase === "question" && (isFollowUp ? <FollowUpReadingInput /> : <NewReadingInput />)}
      {phase === "cards" && <CardSelectionWrapper />}
      {showInterpreter && <Interpreter tarotSessionId={tarotSessionId} />}
      {isPending && <ReadingLoading cards={selectedCards} deckType={selectedDeck.value} />}
      <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
    </Dialog>
  );
}

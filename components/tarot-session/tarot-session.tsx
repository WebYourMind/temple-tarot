"use client";

import { Dialog } from "@radix-ui/react-dialog";
import InfoDialog from "components/info-dialog";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import Interpreter from "./interpreter";
import { FollowUpReadingInput, NewReadingInput } from "./query/query-input";
import { useEffect, useState } from "react";
import Loading from "components/loading";

export default function TarotSession() {
  const { phase, selectedCards, showInfo, setShowInfo, infoContent, isFollowUp, tarotSessionId, isPending } =
    useTarotSession();
  const [showInterpreter, setShowInterpreter] = useState(false);

  useEffect(() => {
    if (phase === "reading" && isFollowUp) {
      setShowInterpreter(true);
    }
  }, [phase, isFollowUp, selectedCards]);

  if (isPending) return <Loading />;

  return (
    <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
      {phase === "question" && (isFollowUp ? <FollowUpReadingInput /> : <NewReadingInput />)}
      {phase === "cards" && <CardSelectionWrapper />}
      {showInterpreter && <Interpreter tarotSessionId={tarotSessionId} />}
      <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
    </Dialog>
  );
}

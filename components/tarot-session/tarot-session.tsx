"use client";

import { Dialog } from "@radix-ui/react-dialog";
import InfoDialog from "components/info-dialog";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import Interpreter from "./interpreter";
import { FollowUpReadingInput, NewReadingInput } from "./query/query-input";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTarotSession } from "app/actions/createTarotSession";

export default function TarotSession() {
  const { phase, selectedCards, showInfo, setShowInfo, infoContent, isFollowUp, tarotSessionId } = useTarotSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showInterpreter, setShowInterpreter] = useState(false);

  console.log("isFollowUp", isFollowUp);

  const handleCreateSession = async () => {
    startTransition(async () => {
      try {
        const tarotSessionId = await createTarotSession();
        router.push(`/readings/${tarotSessionId}`);
      } catch (error) {
        console.error("Failed to create session:", error);
      }
    });
  };

  useEffect(() => {
    if (phase === "reading" && selectedCards && !isFollowUp) {
      console.log("CReating new session");
      handleCreateSession();
    } else if (phase === "reading" && isFollowUp) {
      console.log("Show interpreter");
      setShowInterpreter(true);
    }
  }, [phase, isFollowUp, selectedCards]);

  return (
    <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
      {phase === "question" && (isFollowUp ? <FollowUpReadingInput /> : <NewReadingInput />)}
      {phase === "cards" && <CardSelectionWrapper />}
      {showInterpreter && <Interpreter tarotSessionId={tarotSessionId} />}
      <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
    </Dialog>
  );
}

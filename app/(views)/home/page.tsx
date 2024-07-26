"use client";

import { useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { useTarotSession } from "../../../lib/contexts/tarot-session-context";
import { NewReadingInput } from "./query/query-input";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import InfoDialog from "../../../components/info-dialog";
import { useRouter } from "next/navigation";

export default function Home() {
  const { phase, selectedCards, showInfo, setShowInfo, infoContent } = useTarotSession();

  const router = useRouter();

  useEffect(() => {
    if (phase === "reading" && selectedCards) {
      router.push("/interpretation");
    }
  }, [phase]);

  return (
    <>
      <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
        {phase === "question" && <NewReadingInput />}
        {phase === "cards" && <CardSelectionWrapper />}
        <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
      </Dialog>
    </>
  );
}

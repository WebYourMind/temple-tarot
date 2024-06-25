"use client";

import { useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { useTarotSession } from "../../../lib/contexts/tarot-session-context";
import QueryInput from "./query/query-input";
import CardSelectionWrapper from "./card-selection/card-selection-wrapper";
import InfoDialog from "../../../components/info-dialog";
import { useRouter } from "next/navigation";

export default function Home() {
  const { phase, selectedCards, showInfo, setShowInfo, infoContent, spreadPickerOpen, setSpreadPickerOpen } =
    useTarotSession();

  const router = useRouter();

  useEffect(() => {
    if (phase === "reading" && selectedCards) {
      router.push("/interpretation");
    }
  }, [phase]);

  return (
    <div className="relative flex w-full max-w-4xl grow flex-col p-4 md:container md:pt-16">
      <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
        {phase === "question" && <QueryInput />}
        {phase === "cards" && <CardSelectionWrapper />}
        <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
      </Dialog>
    </div>
  );
}

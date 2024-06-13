"use client";

import { useEffect } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogTrigger } from "components/ui/dialog";
import { Info } from "lucide-react";
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
    <div className="relative flex w-full max-w-4xl grow flex-col p-4 pt-8 fade-in md:container md:pt-16">
      <Dialog open={showInfo} onOpenChange={() => setShowInfo(!showInfo)}>
        <div className="absolute right-4 top-4">
          <DialogTrigger className="opacity-50">
            <Info />
          </DialogTrigger>
        </div>
        <Dialog open={spreadPickerOpen} onOpenChange={() => setSpreadPickerOpen(!spreadPickerOpen)}>
          {phase === "question" && <QueryInput />}
        </Dialog>
        {phase === "cards" && <CardSelectionWrapper />}
        <InfoDialog infoContent={infoContent} closeDialog={() => setShowInfo(false)} />
      </Dialog>
    </div>
  );
}

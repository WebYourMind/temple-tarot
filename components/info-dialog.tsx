"use client";

import { QuestionMarkIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "components/ui/button";

import { DialogContent, DialogTrigger } from "components/ui/dialog";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { infoMap } from "lib/tarot-data/info";
import { cn } from "lib/utils";
import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const InfoButton = ({ type, className = "" }) => {
  const { setShowInfo, setInfoContent } = useTarotSession();

  function handleInfoClick() {
    setInfoContent(infoMap[type]);
    setShowInfo(true);
  }

  return (
    <DialogTrigger
      className={cn("ml-2", buttonVariants({ variant: "ghost", size: "icon" }), className)}
      onClick={() => handleInfoClick()}
    >
      <Info />
    </DialogTrigger>
  );
};

export default function InfoDialog({ infoContent, closeDialog }) {
  return (
    <DialogContent className="my-16 max-h-[80vh] w-full max-w-xs overflow-scroll rounded-md px-4 py-4 md:max-w-2xl">
      <ReactMarkdown className="prose prose-sm prose-indigo mx-auto my-4 w-full max-w-full leading-relaxed text-foreground md:px-4">
        {infoContent}
      </ReactMarkdown>
      <div className="flex justify-center">
        <Button onClick={closeDialog}>Got it!</Button>
      </div>
    </DialogContent>
  );
}

"use client";

import { Button } from "components/ui/button";

import { DialogContent, DialogTrigger } from "components/ui/dialog";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import { infoMap } from "lib/tarot-data/info";
import { cn } from "lib/utils";
import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MagicFont } from "./tarot-flow/query/query-input";

export const InfoButton = ({ type, className = "", children = "" }) => {
  const { setShowInfo, setInfoContent } = useTarotFlow();

  function handleInfoClick() {
    setInfoContent(infoMap[type]);
    setShowInfo(true);
  }

  return (
    <DialogTrigger
      className={cn("ml-1 flex space-x-2 opacity-70", MagicFont.className, className)}
      onClick={() => handleInfoClick()}
    >
      <span className="hidden md:block">{children}</span>
      <Info />
    </DialogTrigger>
  );
};

export default function InfoDialog({ infoContent, closeDialog }) {
  return (
    <DialogContent className="my-16 max-h-[80vh] w-full max-w-xs overflow-scroll rounded-md p-4 md:max-w-2xl">
      <ReactMarkdown className="prose prose-sm prose-indigo mx-auto my-4 w-full max-w-full leading-relaxed text-foreground md:px-4">
        {infoContent}
      </ReactMarkdown>
      <div className="flex justify-center">
        <Button onClick={closeDialog}>Got it!</Button>
      </div>
    </DialogContent>
  );
}

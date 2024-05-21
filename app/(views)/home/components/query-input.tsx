import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import React, { useEffect, useState } from "react";
import { SpreadSelector } from "./spread-selector";
import tarotSpreads from "./tarot-spreads";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";
import { useRouter } from "next/navigation";
import { tarotFont } from "./interpreter";
import { cn } from "lib/utils";
import { Checkbox } from "components/ui/checkbox";
import CardInput from "./card-input";

const QueryInput = ({ onSubmitQuestion, closeDialog, onCardChange, onDeckChange, selectedCards, setHasOwnCards }) => {
  const { credits } = useCredits();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState(tarotSpreads[0]);
  const [showCardInput, setShowCardInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitQuestion(question, selectedSpread);
    setQuestion(""); // Clear the question input after submission
  };

  const onSpreadSelect = (spread) => {
    setSelectedSpread(spread);
    closeDialog();
  };

  useEffect(() => {
    setHasOwnCards(showCardInput);
    if (!showCardInput) {
      onCardChange(null);
    }
  }, [showCardInput]);

  const isSubmitDisabled =
    showCardInput && selectedCards && selectedCards.some((selection) => selection.cardName === "");

  return (
    <div className="container mx-auto mt-8 flex h-full max-w-xl flex-col items-center justify-center space-y-6 px-2 md:mt-10">
      <Label htmlFor="question" className={cn("mb-2 text-center text-xl", tarotFont.className)}>
        What guidance are you seeking?
      </Label>
      <Textarea
        id="question"
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Write about it here (or leave blank for an open reading)..."
        maxLength={5000}
        autoFocus
      />
      <SpreadSelector onSpreadSelect={onSpreadSelect} selectedSpread={selectedSpread} />
      <div className="flex items-center space-x-2">
        <Checkbox id="terms1" checked={showCardInput} onCheckedChange={setShowCardInput as () => void} />
        <div className="grid leading-none">
          <label
            htmlFor="terms1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have my own Tarot deck
          </label>
        </div>
      </div>
      {showCardInput && (
        <CardInput selectedSpread={selectedSpread} onCardChange={onCardChange} onDeckChange={onDeckChange} />
      )}
      <Button
        onClick={handleSubmit}
        variant={"ghost"}
        disabled={!credits || credits === 0 || (showCardInput && isSubmitDisabled)}
      >
        SEND <PaperPlaneIcon className="ml-2" />
      </Button>
      {credits === 0 && (
        <div className="text-center">
          <p>You do not have enough credits!</p>
          <Button onClick={() => router.push("/pricing")} variant={"outline"}>
            Get Credits
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueryInput;

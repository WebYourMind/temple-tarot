import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import React, { useState } from "react";
import { SpreadSelector } from "./spread-selector";
import tarotSpreads from "./tarot-spreads";
import { useCredits } from "lib/contexts/credit-context";
import { useRouter } from "next/navigation";

interface QueryInputProps {
  onSubmitQuestion: (question: string, selectedSpread: any) => void;
  closeDialog: () => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmitQuestion, closeDialog }) => {
  const { credits } = useCredits();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState(tarotSpreads[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmitQuestion(question, selectedSpread);
    setQuestion(""); // Clear the question input after submission
  };

  const onSpreadSelect = (spread) => {
    setSelectedSpread(spread);
    closeDialog();
  };

  return (
    <div className="container mx-auto flex h-full max-w-xl flex-col items-center justify-center space-y-6 px-2 md:mt-10">
      <Label htmlFor="question" className="font-serif text-xl">
        What guidance are you seeking?
      </Label>
      <Textarea
        id="question"
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Write about it here (or leave blank for an open reading)"
        maxLength={5000}
        autoFocus
      />
      <SpreadSelector onSpreadSelect={onSpreadSelect} selectedSpread={selectedSpread} />
      <Button onClick={handleSubmit} variant={"ghost"} disabled={credits < 1}>
        SEND <PaperPlaneIcon className="ml-2" />
      </Button>
      {credits < 1 && (
        <div className="text-center">
          <p>You do not have enough credits!</p>
          <Button onClick={() => router.push("/subscribe")} variant={"outline"}>
            Get Credits
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueryInput;

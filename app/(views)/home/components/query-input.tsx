import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import React, { useState } from "react";
import { SpreadSelector } from "./spread-selector";

interface QueryInputProps {
  onSubmitQuestion: (question: string, selectedSpread: any) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmitQuestion }) => {
  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return; // Prevent submitting empty questions
    onSubmitQuestion(question, selectedSpread);
    setQuestion(""); // Clear the question input after submission
  };

  const onSpreadSelect = (spread) => {
    setSelectedSpread(spread);
  };

  return (
    <div className="container mx-auto flex h-full max-w-xl flex-col items-center justify-center space-y-6 px-2 md:mt-10">
      <Label htmlFor="question" className="font-mono">
        What guidance are you seeking?
      </Label>
      <Textarea
        id="question"
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Write about it here..."
        maxLength={5000}
        autoFocus
      />
      <SpreadSelector onSpreadSelect={onSpreadSelect} selectedSpread={selectedSpread} />
      <Button onClick={handleSubmit} variant={"ghost"} disabled={!selectedSpread || question === ""}>
        SUBMIT <PaperPlaneIcon className="ml-2" />
      </Button>
    </div>
  );
};

export default QueryInput;

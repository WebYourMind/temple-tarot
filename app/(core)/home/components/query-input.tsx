import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import React, { useState } from "react";

interface QueryInputProps {
  onSubmitQuestion: (question: string) => void;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmitQuestion }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return; // Prevent submitting empty questions
    onSubmitQuestion(question);
    setQuestion(""); // Clear the question input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col items-center justify-center space-y-6 md:container">
      <Label htmlFor="question">What guidance are you seeking?</Label>
      <Textarea
        id="question"
        name="question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Write about it here..."
        autoFocus
      />
      <Button type="submit" size={"sm"} variant={"ghost"}>
        SUBMIT <PaperPlaneIcon className="ml-2" />
      </Button>
    </form>
  );
};

export default QueryInput;

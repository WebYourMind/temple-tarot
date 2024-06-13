import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { useState, useEffect } from "react";
import SpreadSelector from "./spread-selector";
import { useRouter } from "next/navigation";
import { cn } from "lib/utils";
import { Checkbox } from "components/ui/checkbox";
import CardInput from "./card-input";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";

const QueryInput = () => {
  const { handleSubmitQuestion, selectedCards, setSelectedCards, setHasOwnCards, query, setQuery } = useTarotSession();
  const { hasAccess } = useUserAccessPlan();
  const router = useRouter();
  const [showCardInput, setShowCardInput] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitQuestion();
  };

  useEffect(() => {
    setHasOwnCards(showCardInput);
    if (!showCardInput) {
      setSelectedCards(null);
    }
  }, [showCardInput]);

  const isSubmitDisabled = showCardInput && selectedCards?.some((selection) => selection.cardName === "");

  return (
    <div className="container mx-auto flex h-full max-w-xl flex-col items-center justify-center space-y-6 px-2 md:mt-10">
      <Label htmlFor="question" className={cn("mb-2 px-2 text-center font-sans text-xl md:px-0")}>
        What guidance are you seeking?
      </Label>
      <Textarea
        id="question"
        name="question"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write about it here (or leave blank for an open reading)..."
        maxLength={5000}
        rows={4}
        autoFocus
      />
      <SpreadSelector />
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
      {showCardInput && <CardInput />}
      {hasAccess ? (
        <Button onClick={handleSubmit} variant={"ghost"} disabled={(showCardInput && isSubmitDisabled) || hasAccess}>
          SEND <PaperPlaneIcon className="ml-2" />
        </Button>
      ) : (
        <div className="text-center">
          <p>Sorry, you do not have an active pass or subscription.</p>
          <Button onClick={() => router.push("/pricing")} variant={"outline"}>
            Go To Pricing
          </Button>
        </div>
      )}
    </div>
  );
};

export default QueryInput;
